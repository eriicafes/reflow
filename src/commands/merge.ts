import chalk from "chalk"
import { config } from "../utils/config"
import { getWorkingBranches, getCurrentBranch, mergeBranchToMain } from "../utils/git"
import { line, logger } from "../utils/logger"
import { prompt } from "../utils/prompt"

type MergeOptions = {
    dryRun: boolean,
    preferFastForward: boolean
}

export const merge = async ({dryRun, preferFastForward}: MergeOptions) => {
    try {
        const branch = await getCurrentBranch()

        if (branch === config.mainBranch) {
            const workingBranches = await getWorkingBranches()

            if (!workingBranches.length) {
                logger.log("No working branches available")
                process.exit()
            }

            const {targetBranch, proceed, cleanup} = await prompt([
                {
                    type: "list",
                    name: "targetBranch",
                    message: `Which branch do you want to merge to ${config.mainBranch}`,
                    choices: workingBranches
                },
                {
                    type: "confirm",
                    name: "proceed",
                    message(ctx) {
                        return `Do you really want to merge ${ctx.targetBranch} to ${config.mainBranch}`
                    },
                },
                {
                    type: "confirm",
                    name: "cleanup",
                    message: "Delete this branch after a successful merge",
                }
            ])

            logger.log(line() + line("Merging", targetBranch, "into", config.mainBranch, dryRun ? chalk.bold.yellow("[Dry Run]") : ""))

            if (proceed && !dryRun) await mergeBranchToMain(branch, targetBranch, preferFastForward, cleanup)

        } else {
            const {proceed, cleanup} = await prompt([
                {
                    type: "confirm",
                    name: "proceed",
                    message: `Do you want to merge this branch to ${config.mainBranch}`
                },
                {
                    type: "confirm",
                    name: "cleanup",
                    message: "Delete this branch after a successful merge",
                    when: (ctx) => ctx.proceed
                }
            ])

            if (proceed) {
                logger.log(line() + line("Merging", branch, "into", config.mainBranch, dryRun ? chalk.bold.yellow("[Dry Run]") : ""))

                if(!dryRun) await mergeBranchToMain(branch, branch, preferFastForward, cleanup)
            }
        } 
    } catch (err: any) {
        logger.error(err.message)
        
        process.exit(1)
    }

}
import chalk from "chalk"
import { config } from "../utils/config"
import { getWorkingBranches, getCurrentBranch, mergeBranchToMain, pullAndRebaseFromMain } from "../utils/git"
import { line, logger } from "../utils/logger"
import { prompt } from "../utils/prompt"

type MergeOptions = {
    dryRun: boolean,
    preferFastForward: boolean
}

export const merge = async ({dryRun, preferFastForward}: MergeOptions) => {
    try {
        const branch = await getCurrentBranch()

        if (branch === config.branch.main) {
            const workingBranches = await getWorkingBranches()

            if (!workingBranches.length) {
                logger.log("No working branches available")
                process.exit()
            }

            const {targetBranch, proceed, deleteOnSuccess} = await prompt([
                {
                    type: "list",
                    name: "targetBranch",
                    message: `Which branch do you want to merge to ${config.branch.main}`,
                    choices: workingBranches
                },
                {
                    type: "confirm",
                    name: "proceed",
                    message(ctx) {
                        return `Do you really want to merge ${ctx.targetBranch} to ${config.branch.main}`
                    },
                },
                {
                    type: "confirm",
                    name: "deleteOnSuccess",
                    message: "Delete this branch after a successful merge",
                }
            ])

            logger.log(line() + line("Merging", targetBranch, "into", config.branch.main, dryRun ? chalk.bold.yellow("[Dry Run]") : ""))

            if (proceed && !dryRun) await mergeBranchToMain(targetBranch, { preferFastForward, deleteOnSuccess })

        } else {
            const {proceed, deleteOnSuccess} = await prompt([
                {
                    type: "confirm",
                    name: "proceed",
                    message: `Do you want to merge this branch to ${config.branch.main}`
                },
                {
                    type: "confirm",
                    name: "deleteOnSuccess",
                    message: "Delete this branch after a successful merge",
                    when: (ctx) => ctx.proceed
                }
            ])

            logger.log(line() + line("Merging", branch, "into", config.branch.main, dryRun ? chalk.bold.yellow("[Dry Run]") : ""))

            if (proceed && !dryRun) await mergeBranchToMain(branch, { preferFastForward, deleteOnSuccess })

        } 
    } catch (err: any) {
        logger.error(err.message)
        
        process.exit(1)
    }
}
import chalk from "chalk"
import { config } from "../utils/config"
import { getCurrentBranch, isMergeContext, pushWithTags } from "../utils/git"
import { line, lineAfter, logger } from "../utils/logger"
import standardVersion from "standard-version"
import { s } from "../utils/snippets"

type ReleaseOptions = {
    dryRun: boolean,
    push: boolean
}

export const release = async ({dryRun, push}: ReleaseOptions) => {
    try {
        const branch = await getCurrentBranch()
        
        if (branch !== config.mainBranch) {

            if (isMergeContext()) process.exit(0) // release was called (by post-merge hook) during merge to another branch

            // error since release was called (manually) in another branch
            throw new Error(
                lineAfter("Unsupported release branch", chalk.yellow(`<${branch}>`) + ":") +
                line("Consider merging this branch to", `'${config.mainBranch}'`, "before relaseing")
            )
        }

        logger.log(
            line(chalk.magentaBright("Releasing:"),
            chalk.blueBright(branch),
            dryRun ? chalk.bold.yellow("[Dry Run]") : "")
        )

        await standardVersion({
            // @ts-ignore
            // A bug in standard-version argument parsing with yargs (Negating Boolean Arguments '--no-verify') has led the option 'noVerify' to be specified instead of 'verify'
            verify: false,
            commitAll: true,
            dryRun,
        })

        if (push) {
            logger.log(
                line() + line(
                    chalk.magentaBright("Pushing changes and tags..."),
                    dryRun ? chalk.bold.yellow("[Dry Run]") : ""
                )
            )

            if (!dryRun) await pushWithTags()
        } else {
            logger.log(
                line("Run", chalk.green(s("git push --follow-tags")), "to push changes")
            )
        }

        process.exit()

    } catch (err: any) {
        logger.error(err.message)
        
        process.exit(1)
    }
}
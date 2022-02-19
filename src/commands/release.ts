import chalk from "chalk"
import { config } from "../utils/config"
import { getCurrentBranch, isMergeContext } from "../utils/git"
import { line, lineAfter, logger } from "../utils/logger"

export const release = async () => {
    const branch = await getCurrentBranch()

    try {
        if (branch !== config.mainBranch) {

            if (isMergeContext()) process.exit(0) // release was called during merge to another branch

            // error since release was called in another branch
            throw new Error(
                lineAfter("Unsupported release branch", chalk.yellow(`<${branch}>`) + ":") +
                line("Consider merging this branch to", `'${config.mainBranch}'`, "before relaseing")
            )
        }

        logger.log(
            chalk.magentaBright("Releasing:"),
            chalk.blueBright(branch),
        )

    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
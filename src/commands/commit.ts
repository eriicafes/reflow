import { getCurrentBranch } from "../utils/git"
import {parseBranch} from "../utils/branch"
import { logger } from "../utils/logger"
import chalk from "chalk"

export const commit = async () => {
    const branch = await getCurrentBranch()

    try {
        const [type, details] = parseBranch(branch)
    
        logger.log(
            chalk.magentaBright("Committing:"),
            chalk.blueBright(type),
            details
        )
    
        process.exit()
    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
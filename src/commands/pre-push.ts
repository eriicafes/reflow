import { getCurrentBranch, pullAndRebaseMainFromRemote } from "../utils/git"
import { line, logger } from "../utils/logger"
import chalk from "chalk"
import { config } from "../utils/config"

export const prePush = async () => {
    try {
        const branch = await getCurrentBranch()
        
        // Rebase main branch to match remote before pushing
        if (branch === config.branch.main) {
            
            logger.log(
                line("Updating", chalk.green(config.branch.main), "before pushing")
            )

            await pullAndRebaseMainFromRemote()
        }
    
        process.exit()
    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
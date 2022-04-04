import { getCurrentBranch, isMergeContext } from "../utils/git"
import {parseBranch} from "../utils/branch"
import { line, lineAfter, logger } from "../utils/logger"
import chalk from "chalk"
import { config } from "../utils/config"
import { snippets } from "../utils/snippets"

export const preCommit = async () => {
    try {
        const branch = await getCurrentBranch()
        
        // Check if a merge conflict is being resolved in the main branch
        if (branch === config.branch.main && isMergeContext()) {
            
            logger.log(
                lineAfter("Unable to resolve merge automatically") + 
                line("Run", chalk.green(snippets.release), "to release changes")
            )

        } else {
            // This is a standard commit, go ahead and verify the branch
            const [type, details] = parseBranch(branch)
        
            logger.log(
                chalk.magentaBright("Committing:"),
                chalk.blueBright(type),
                details
            )
        }
    
        process.exit()
    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
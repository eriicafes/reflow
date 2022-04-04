import { isValidBranch } from "../utils/branch"
import { logger } from "../utils/logger"
import { config } from "../utils/config"
import { prompt } from "../utils/prompt"
import { checkoutNewBranch, renameCurrentBranch } from "../utils/git"
import chalk from "chalk"

type BranchOptions = {
    name?: string,
    parent?: string,
    rename: boolean
}

export const branch = async ({name, parent, rename}: BranchOptions) => {
    try {
        let newBranchName: string

        if (isValidBranch(name)) {
            newBranchName = name
        } else {
            const {type, promptName} = await prompt([
                {
                    type: "list",
                    name: "type",
                    message: rename ? "What type of branch is this?" : "What are you going to be working on?",
                    choices: config.branch.allowed
                },
                {
                    name: "promptName",
                    message: "Give this branch a name",
                    default: () => name?.split("/").filter(c => c).join("-"),
                    transformer: (val, ctx) => ctx.type + "/" + val,
                    validate: (val) => val ? true : "Branch name is required"
                }
            ]) 

            newBranchName = type + "/" + promptName
        }

        if (rename) {
            logger.log("Renaming current branch to", chalk.blueBright(newBranchName))
            
            await renameCurrentBranch(newBranchName)
        } else {
            logger.log("Checking out new branch", chalk.blueBright(newBranchName), (parent ? `off ${chalk.blueBright(parent)}` : ""))
            
            await checkoutNewBranch(newBranchName, parent)
        }
    
        process.exit()
    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
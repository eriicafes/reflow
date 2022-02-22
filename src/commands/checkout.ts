import { isValidBranch, isValidBranchType } from "../utils/branch"
import { line, logger } from "../utils/logger"
import { config } from "../utils/config"
import { prompt } from "../utils/prompt"
import { checkoutBranch, checkoutNewBranch, getWorkingBranches, renameCurrentBranch } from "../utils/git"
import chalk from "chalk"

type CheckoutOptions = {
    type?: string,
}

export const checkout = async ({type}: CheckoutOptions) => {
    try {
        let branches = await getWorkingBranches()

        // Filter the branches if type was provided
        if (type) branches = branches.filter(b => b.startsWith(type))

        // If no branches found and type is not the mainBranch, exit with a proper message
        if (!branches.length && type !== config.mainBranch) {

            if (type) {
                // Check is any allowed branches was matched
                const possibleBranches = config.allowedBranches.filter(b => b.startsWith(type))

                // Fail only when filter result is empty as a result of an unknown branch type
                // This happens when the provided type does not match any allowed branch
                if (!possibleBranches.length) throw new Error(line("Unsupported branch type", chalk.yellow(`'${type}'`)))

                const last = possibleBranches.pop()
                const searchedTypes = possibleBranches.length ? (possibleBranches.join(", ") + " or " + last) : last

                logger.log(`No ${searchedTypes} branches found`)
            } else {
                logger.log(`No branch found`)
            }

            process.exit()
        }

        const {branch} = await prompt([
            {
                type: "list",
                name: "branch",
                message: "Which branch would you like to checkout",
                // Append the main branch to the list only if type was not provided
                choices: (type ? [] : [config.mainBranch]).concat(branches),
                // Prompt unless provided type is mainBranch
                when: () => type !== config.mainBranch,
            }
        ])

        await checkoutBranch(branch || config.mainBranch)

        process.exit()
    } catch (err: any) {
        logger.error(err.message)

        process.exit(1)
    }
}
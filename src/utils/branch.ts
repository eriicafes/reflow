import {config} from "./config"
import chalk from "chalk"
import {line, lineAfter} from "./logger"
import { snippets } from "./snippets"

const randomBranch = () => {
    const index = Math.floor(Math.random() * config.allowedBranches.length)

    return config.allowedBranches[index] + config.delimeter + "details-about-commit"
}

const delimeterExample = chalk.blue(`'${config.delimeter}'`)

const branchExample = chalk.blue(`(eg. ${randomBranch()})`)

const isValidBranch = <T extends U, U>(branches: ReadonlyArray<T>, type: U): type is T  => {
    if (branches.includes(type as T)) return true

    return false
}

export const parseBranch = (branch: string) => {
    try {
        const [type, ...details] = branch.split(config.delimeter)

        if (!details.length) {
            throw new Error(`Commit branch name should contain a ${delimeterExample} to show branch type ${branchExample}`)
        }
        
        if (details.length > 1) {
            throw new Error(`Commit branch name should contain only one ${delimeterExample} ${branchExample}`)
        }

        if (!isValidBranch(config.allowedBranches, type)) {
            throw new Error()
        }

        return [type, details[0]] as const

    } catch (err: any) {
        throw new Error(
            lineAfter("Unsupported commit branch", chalk.yellow(`<${branch}>`) + ":") +
            (branch === config.mainBranch
                ? lineAfter(`Consider checking out '${config.mainBranch}' to a working branch`) +
                    line ("Run", chalk.green(snippets.branch), "to checkout a working branch")
                : (err.message ? (lineAfter(err.message)) : "") +
                    line("Consider renaming this branch before committing") +
                    line(
                        "Supported branches are prefixed with:", chalk.blueBright(config.allowedBranches),
                        err.message ? "" : branchExample
                    ) +
                    line() +
                    line("Run", chalk.green(snippets.branchRename), "to rename this branch")
            )

        )
    }
}
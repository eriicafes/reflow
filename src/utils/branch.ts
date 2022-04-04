import { config } from "./config"
import chalk from "chalk"
import {line, lineAfter } from "./logger"
import { snippets } from "./snippets"

const randomBranch = () => {
    const index = Math.floor(Math.random() * config.branch.allowed.length)

    return config.branch.allowed[index] + config.branch.delimeter + "details-about-commit"
}
const delimeterExample = chalk.blue(`'${config.branch.delimeter}'`)
const branchExample = chalk.blue(`(eg. ${randomBranch()})`)

type AllowedBranches = typeof config.branch.allowed[number]

export const isValidBranchType = <A extends AllowedBranches>(type: string, allowedBranchTypes?: ReadonlyArray<A>): type is A  => {
    if ((allowedBranchTypes || config.branch.allowed).includes(type as A)) return true

    return false
}

export const isValidBranch = <A extends AllowedBranches>(branch: string | undefined, allowedBranchTypes?: ReadonlyArray<A>): branch is `${A}/${string}` => {
    if (!branch) return false

    const [type, ...details] = branch.split(config.branch.delimeter)

    // Only valid if branch is in the exact format we want and has a valid branch type
    if (details.length === 1 && isValidBranchType(type, allowedBranchTypes)) return true

    return false
}

export const parseBranch = (branch: string) => {
    try {
        const [type, ...details] = branch.split(config.branch.delimeter)

        // Give more detailed info why branch is not valid
        
        if (!details.length) {
            throw new Error(`Commit branch name should contain a ${delimeterExample} to show branch type ${branchExample}`)
        }
        
        if (details.length > 1) {
            throw new Error(`Commit branch name should contain only one ${delimeterExample} ${branchExample}`)
        }

        if (!isValidBranchType(type)) {
            throw new Error()
        }

        return [type, details[0]] as const

    } catch (err: any) {
        throw new Error(
            lineAfter("Unsupported commit branch", chalk.yellow(`${branch}`) + ":") +
            (branch === config.branch.main
                ? lineAfter(`Consider checking out '${config.branch.main}' to a working branch`) +
                    line ("Run", chalk.green(snippets.branch), "to checkout a working branch")
                : (err.message ? (lineAfter(err.message)) : "") +
                    line("Consider renaming this branch before committing") +
                    line(
                        "Supported branches are prefixed with:", chalk.blueBright(config.branch.allowed),
                        err.message ? "" : branchExample
                    ) +
                    line() +
                    line("Run", chalk.green(snippets.branchRename), "to rename this branch")
            )

        )
    }
}
import { exec, spawn } from "./exec"
import fs from "fs"
import path from "path"
import { prompt } from "./prompt"
import { line, logger } from "./logger"
import chalk from "chalk"
import { s } from "./snippets"
import { config } from "./config"

export const getCurrentBranch = async () => {
    const { stdout } = await exec("git rev-parse --abbrev-ref HEAD")
    
    return stdout.trim()
}

export const getWorkingBranches = async () => {
    const { stdout } = await exec("git branch")

    const branches = stdout.
        trim()
        .split("\n")
        .map(b => b.replace("*", "").trim())
        .filter(b => b !== config.mainBranch)

    return branches
}

export const checkoutBranch = async (name: string) => {
    await exec(`git checkout ${name}`)
}

export const checkoutNewBranch = async (name: string, parent?: string) => {
    await exec(`git checkout -b ${name}` + (parent ? ` ${parent}` : ""))
}

export const renameCurrentBranch = async (name: string) => {
    await exec(`git branch -m ${name}`)
}

export const mergeBranchToMain = async (currentBranch: string, targetBranch: string, preferFastForward: boolean, deleteOnSuccess: boolean) => {
    // Checkout mainBranch if not there initially
    if (currentBranch !== config.mainBranch) {
        logger.log("Checking out " + config.mainBranch)
        await exec(`git checkout ${config.mainBranch}`)
    }

    // Now in mainBranch
    await spawn(`git merge ${targetBranch} ${preferFastForward ? "--ff-only" : "--no-ff"}`)
        .then(async () => {
            if (deleteOnSuccess) await exec(`git branch -d ${targetBranch}`)
        })
        .finally(async () => {
            // Return back to current branch if checked out main and branch was not deleted
            if (!deleteOnSuccess && currentBranch !== config.mainBranch) await exec(`git checkout ${currentBranch}`)
        })
}

export const isMergeContext = () => {

    const gitDir = fs.readdirSync(path.join(process.cwd(), ".git"))

    return gitDir.includes("MERGE_HEAD")
}

export const setUpstreamBranch = async () => {
    const currentBranch = await getCurrentBranch()

    logger.log("This branch does not have an upstream branch set:")

    const {remote, branch} = await prompt([
        {
            name: "remote",
            message: "Enter remote repository tracking your local repository",
            default: "origin"
        },
        {
            name: "branch",
            message: "Enter remote branch to track local branch",
            default: currentBranch
        }
    ])

    await exec(`git push --set-upstream ${remote} ${branch}`)

    logger.log("upstream set for", currentBranch, "as:", remote, branch)
}

export const pushWithTags = async () => {
    const currentBranch = await getCurrentBranch()
    const push = exec("git push --follow-tags")

    try {
        await push
            
    } catch (err: any) {
        if (!err.stderr.includes("no upstream branch")) throw err

        await setUpstreamBranch().catch((e) => {
            logger.log(
                line("Unable to set upstream branch") + 
                line("Run", chalk.green(s(`git push --set-upstream origin ${currentBranch} --follow-tags`)), "to push changes")
            )

            throw(e)
        })

        await push
    }
}

export const gitDescribeTags = async () => {

    const {stdout: gitDescribe} = await exec("git describe --tags")

    const [lastTag, commitsAfterTag, latestCommit] = gitDescribe.trim().split("-") as [string, string?, string?]

    return {
        lastTag, 
        latestCommit: latestCommit ? latestCommit.slice(1) : undefined,
        commitsAfterTag: parseInt(commitsAfterTag || "0")
    }
}
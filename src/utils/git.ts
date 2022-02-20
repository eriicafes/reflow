import { exec } from "./exec"
import fs from "fs"
import path from "path"
import { prompt } from "./prompt"
import { line, lineAfter, logger } from "./logger"
import chalk from "chalk"
import { s } from "./snippets"

export const getCurrentBranch = async () => {
    const { stdout } = await exec("git rev-parse --abbrev-ref HEAD")

    return stdout.trim()
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

        await setUpstreamBranch().catch(() => {
            logger.log(
                line("Unable to set upstream branch") + 
                line("Run", chalk.green(s(`git push --set-upstream origin ${currentBranch} --follow-tags`)), "to push changes")
            )
        })

        await push
    }
}
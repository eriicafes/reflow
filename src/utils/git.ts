import { exec } from "./exec"
import fs from "fs"
import path from "path"

export const getCurrentBranch = async () => {
    const { stdout } = await exec("git rev-parse --abbrev-ref HEAD")

    return stdout.trim()
}

export const isMergeContext = () => {

    const gitDir = fs.readdirSync(path.join(process.cwd(), ".git"))

    return gitDir.includes("MERGE_HEAD")
}
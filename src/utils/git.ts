import { exec } from "./exec"

export const getCurrentBranch = async () => {
    const { stdout } = await exec("git rev-parse --abbrev-ref HEAD")

    return stdout.trim()
}
import fs from "fs"
import path from "path"

export const ROOT_DIR = path.resolve(__dirname, "..", "..")
export const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json")

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"))

export const config = {
    name: packageJson.name.split("/").pop() as string,
    version: packageJson.version as string,
    description: packageJson.description as string,
    delimeter: "/",
    mainBranch: "fyb",
    allowedBranches: ["feature", "fix", "chore", "refactor", "build", "style", "docs", "test"] as const
}
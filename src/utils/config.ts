import chalk from "chalk"
import fs from "fs"
import path from "path"
import { line, logger } from "./logger"
// @ts-ignore
import { getConfiguration } from "standard-version/lib/configuration.js"

export const ROOT_DIR = path.resolve(__dirname, "..", "..")
export const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json")
export const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"))

export const standardVersionConfig = getConfiguration()

// default branch config
const branchConfig = {
    main: "main",
    remote: "origin",
    delimeter: "/",
    allowed: ["feature", "fix", "chore", "refactor", "build", "style", "docs", "test"]
}

export const config = {
    name: packageJson.name.split("/").pop() as string,
    version: packageJson.version as string,
    description: packageJson.description as string,
    branch: branchConfig
}

function validateAndMergeConfig() {
    try {
        // replace branch config defaults is specified in version config file
        const branchConfigKeys = Object.keys(branchConfig) as (keyof typeof branchConfig)[]
        branchConfigKeys.forEach(key => {
            const standardVersionConfigValue = standardVersionConfig.branch?.[key]

            // check if version file has branch config key
            if (standardVersionConfigValue) {
                // validate and set branch config

                // validate strings
                // if default config value is a string, provided value must also be a string
                if (typeof branchConfig[key] === "string") {
                    if (typeof standardVersionConfigValue === "string") {
                        branchConfig[key] = standardVersionConfigValue as any
                    } else {
                        throw new Error(`Invalid configuration provided in ${chalk.yellow(`branch.${key}`)}. Expected string but got ${typeof standardVersionConfigValue}.`)
                    }
                }

                // validate string arrays
                // if default config value is an array of strings, provided value must also be an array of strings
                const arrayKeys = ["allowed"]
                if (arrayKeys.includes(key)) {
                    if (Array.isArray(standardVersionConfigValue)) {
                        if (standardVersionConfigValue.every(value => typeof value === "string")) {
                            branchConfig[key] = standardVersionConfigValue as any
                        } else {
                            throw new Error(`Invalid configuration provided in ${chalk.yellow(`branch.${key}`)}. Expected string array but got array containing non-string values.`)
                        }
                    } else {
                        throw new Error(`Invalid configuration provided in ${chalk.yellow(`branch.${key}`)}. Expected string array but got ${typeof standardVersionConfigValue}.`)
                    }
                }
            }
        })
    } catch (err: any) {
        logger.log(
            line(chalk.yellow("Configuration Error:")) +
            line(err.message),
        )

        process.exit(1)
    }
}

validateAndMergeConfig()
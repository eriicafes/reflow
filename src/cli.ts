#!/usr/bin/env node

import { Command, InvalidOptionArgumentError } from "commander";
import chalk from "chalk";
import { branch } from "./commands/branch";
import { checkout } from "./commands/checkout";
import { preCommit } from "./commands/pre-commit";
import { merge } from "./commands/merge";
import { release } from "./commands/release";
import { config } from "./utils/config";
import { prePush } from "./commands/pre-push";

const program = new Command()

program
    .name(config.name)
    .description(config.description)
    .version(config.version)
    .version(config.version, "-v", "alias for -v, --version")

// Branch
program
    .command("branch [name] [parent]")
    .description("Checkout a new branch or rename current branch")
    .option("-r --rename", "rename branch", false)
    .action(async (name, parent, options) => {
        await branch({name, parent, rename: options.rename})
    })

// Checkout
program
    .command("checkout [type]")
    .description("Checkout branch from list (filtered by type if provided)")
    .action(async (type) => {
        await checkout({type})
    })

// Pre-commit
program
    .command("precommit")
    .description("Pre-commit hook to validate a commit")
    .action(async () => {
        await preCommit()
    })

// Merge
program
    .command("merge")
    .description("Create a merge request and run a release (if no merge conflict)")
    .option("--prefer-ff", "perform a fast-foward merge", false)
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .action(async (options) => {
        await merge({dryRun: options.dryRun, preferFastForward: options.preferFf})
    })

// Release
program
    .command("release")
    .description("Run release by bumping version number tagging commit and pushing changes")
    .option("--no-push", "prevent pushing changes and tags to remote")
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .option("-f --force", "force release when not in a CI environment", false)
    .option("--as <type>", "release with a specific version type", parseReleaseType)
    .action(async (options) => {
        await release({dryRun: options.dryRun, push: options.push, force: options.force, as: options.as})
    })

// Pre-release
program
    .command("prerelease [name]")
    .description("Run a pre-release")
    .option("--no-push", "prevent pushing changes and tags to remote")
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .option("--as <type>", "release with a specific version type", parseReleaseType)
    .action(async (name, options) => {
        await release({dryRun: options.dryRun, push: options.push, force: true, as: options.as, preRelease: true, preReleaseTag: name})
    })

// Pre-push
program
    .command("prepush")
    .description("Update main branch before pushing")
    .action(async () => {
        await prePush()
    })

program.parseAsync()

function parseReleaseType(value: string) {
    const validReleaseTypes = ["major", "minor", "patch"]

    if (!validReleaseTypes.includes(value)) {
        throw new InvalidOptionArgumentError(
            `"${value}" is not one of ${chalk.green(validReleaseTypes.join(", "))}`
        )
    }
    return value
}
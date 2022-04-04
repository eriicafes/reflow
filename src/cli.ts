#!/usr/bin/env node

import { Command } from "commander";
import { branch } from "./commands/branch";
import { checkout } from "./commands/checkout";
import { commit } from "./commands/commit";
import { merge } from "./commands/merge";
import { release } from "./commands/release";
import { config } from "./utils/config";

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

// Commit
program
    .command("commit")
    .description("Pre-commit hook to validate a commit")
    .action(async () => {
        await commit()
    })

// Merge
program
    .command("merge")
    .description("Create a merge request and run a release (if no merge conflict)")
    .option("-p --prefer-ff", "see the commands that would run without affecting any files", false)
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .action(async (options) => {
        await merge({dryRun: options.dryRun, preferFastForward: options.preferFf})
    })

// Release
program
    .command("release")
    .description("Run release by bumping version number tagging commit and pushing changes (also Post-merge hook)")
    .option("-P --no-push", "prevent pushing changes and tags to remote")
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .action(async (options) => {
        await release({dryRun: options.dryRun, push: options.push})
    })

program.parseAsync()
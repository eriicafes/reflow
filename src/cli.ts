#!/usr/bin/env node

import { Command } from "commander";
import { branch } from "./commands/branch";
import { commit } from "./commands/commit";
import { merge } from "./commands/merge";
import { release } from "./commands/release";
import { config } from "./utils/config";

const program = new Command()

program
    .name(config.name)
    .description(config.description)
    .version(config.version);

// Default
program
    .action(() => console.log("Yayy!"))

// Branch
program
    .command("branch [name] [parent]")
    .option("-r --rename", "see the commands that would run without affecting any files", false)
    .action(async (name, parent, options) => {
        await branch({name, parent, rename: options.rename})
    })


// Commit
program
    .command("commit")
    .action(async () => {
        await commit()
    })

// Merge
program
    .command("merge")
    .option("-p --prefer-ff", "see the commands that would run without affecting any files", false)
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .action(async (options) => {
        await merge({dryRun: options.dryRun, preferFastForward: options.preferFf})
    })

// Release
program
    .command("release")
    .option("-P --no-push", "prevent pushing changes and tags to remote")
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .action(async (options) => {
        await release({dryRun: options.dryRun, push: options.push})
    })

program.parseAsync()
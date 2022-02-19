#!/usr/bin/env node

import { Command } from "commander";
import { commit } from "./commands/commit";
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

// Commit
program
    .command("commit")
    .action(async () => {
        await commit()
    })

program
    .command("release")
    .option("-d --dry-run", "see the commands that would run without affecting any files", false)
    .option("--no-push", "prevent pushing changes and tags to remote")
    .action(async (options) => {
        await release({dryRun: options.dryRun, push: options.push})
    })

program.parseAsync()
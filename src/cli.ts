#!/usr/bin/env node

import { Command } from "commander";
import { commit } from "./commands/commit";
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

program.parseAsync()
#!/usr/bin/env node

import { Command } from "commander";
import { CommandLoader } from "./commands";

const program = new Command();

CommandLoader.load(program);

program.parseAsync();

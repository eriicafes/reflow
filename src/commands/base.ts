import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
import { config } from "../utils/config";
import { line, logger } from "../utils/logger";
import { CliError } from "../utils/error";

export type Program = Command & { command: never; action: never };
export type Env = "global" | "local";
export type OptionalArg = string | undefined;
export type RequiredArg = string;
export interface BaseOptions {
  dryRun?: boolean;
}

export abstract class SubCommand {
  constructor(private readonly program: Command) {}

  // command attributes
  protected abstract command: string;
  protected abstract setup(program: Program): Command;
  protected abstract action(...args: any[]): Promise<void> | void;

  // optional attributes
  protected allowGlobal = false;
  protected allowDryRun = true;

  public load(env: Env) {
    // registering sub command
    const subProgram = this.program.command(this.command);

    if (this.allowDryRun) {
      subProgram.option(
        "-d --dry-run",
        "see the commands that would run without affecting any files"
      );
    }

    this.setup(subProgram as Program).action(async (...args) => {
      try {
        // check if in a node project by checking if package.json exists in the current directory
        if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
          throw new CliError.Fatal(
            `Could not find ${chalk.green(
              "package.json"
            )} file, are you sure you are in a node project?`
          );
        }

        // check if global bin is allowed
        if (env === "global" && !this.allowGlobal) {
          throw new CliError.Fatal(
            `Seems like you only installed ${chalk.green(
              config.name
            )} globally, however a local installation is also required.`
          );
        }

        if (args[args.length - 2]?.dryRun) {
          logger.for("[dry run]").warn(line("no changes will be committed"));
        }

        await this.action(...args);
        // not sure why an explicit process exit was needed,
        // but disabling until it is needed (which I dont think it will)
        // it currently causes the program to exit early before the commitizen commit prompt starts or finishes

        // process.exit()
      } catch (err) {
        if (CliError.Info.isInstance(err)) {
          logger.log(err.message);
        } else if (CliError.Warn.isInstance(err)) {
          logger.warn(err.message);
        } else if (CliError.Git.isInstance(err)) {
          logger.log(line() + err.message);
        } else if (err instanceof Error) {
          logger.error(err.message);
        } else logger.error("program exited unexpectedly!");
        process.exit(1);
      }
    });
  }
}

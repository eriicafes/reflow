import path from "path";
import { Command } from "commander";
import { config, packageJson, ROOT_DIR } from "../utils/config";
import { Env, SubCommand } from "./base";
import { BranchCommand } from "./branch";
import { CheckoutCommand } from "./checkout";
import { CommitCommand } from "./commit";
import { GenerateCommand } from "./generate";
import { InitCommand } from "./init";
import { MergeCommand } from "./merge";
import { PreCommitCommand } from "./pre-commit";
import { PrePushCommand } from "./pre-push";
import { PushCommand } from "./push";
import { PreReleaseCommand } from "./pre-release";
import { ReleaseCommand } from "./release";

type SubCommandConstructor = new (
  ...args: ConstructorParameters<typeof SubCommand>
) => SubCommand;

export class CommandLoader {
  private constructor(private readonly program: Command, private env: Env) {}

  private readonly commands: SubCommandConstructor[] = [
    InitCommand,
    BranchCommand,
    CheckoutCommand,
    CommitCommand,
    GenerateCommand,
    MergeCommand,
    PushCommand,
    PreReleaseCommand,
    ReleaseCommand,
    PreCommitCommand,
    PrePushCommand,
  ];

  private load() {
    this.program
      .name(config.name)
      .description(config.description)
      .version(config.version)
      .version(config.version, "-v", "alias for -v, --version");

    this.addCommands();
  }

  private addCommands() {
    this.commands.forEach((CommandClass) =>
      new CommandClass(this.program).load(this.env)
    );
  }

  public static load(program: Command) {
    const LocalCommandLoader = this.localLoader();

    if (LocalCommandLoader) {
      return new LocalCommandLoader(program, "local").load();
    } else {
      return new CommandLoader(program, "global").load();
    }
  }

  private static localLoader(): typeof this | undefined {
    const localLoaderPath = path.join(
      process.cwd(),
      "node_modules",
      ...(packageJson.name as string).split("/"),
      "lib",
      "commands"
    );

    try {
      if (process.cwd() === ROOT_DIR) {
        return this;
      }

      const localLoaderFile = require(localLoaderPath);

      return localLoaderFile.CommandLoader as typeof this;
    } catch (error) {
      return undefined;
    }
  }
}

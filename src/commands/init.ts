import { exec } from "../utils/exec";
import { TemplateGenerator } from "../utils/generator";
import { HooksManager } from "../utils/hooks";
import { DependenciesManager } from "../utils/dependencies";
import { ScriptsManager } from "../utils/scripts";
import { BaseOptions, Program, SubCommand } from "./base";
import { line, logger } from "../utils/logger";
import { createLoader } from "../utils/loader";
import chalk from "chalk";
import { snip } from "../utils/snippets";
import fs from "fs";
import { CliError } from "../utils/error";
import path from "path";
import { getCurrentBranch } from "../utils/git";

interface Options extends BaseOptions {
  install: boolean;
  lib?: boolean;
}

export class InitCommand extends SubCommand {
  private generator = new TemplateGenerator();
  private dependenciesManager = new DependenciesManager();
  private hooksManager = new HooksManager();
  private scriptsManager = new ScriptsManager();

  public command = "init";

  protected allowGlobal = true;

  public setup(program: Program) {
    return program
      .description("initialize reflow workspace")
      .option("-n --no-install", "turn off automatic package installation")
      .option("--lib", "initialize as an npm library");
  }

  public async action(options: Options) {
    const start = Date.now();

    logger.log(`🪄✨ initializing reflow workspace 🚀`, line());

    await this.isGitInitialized();

    // install dependencies
    await this.dependenciesManager.install(
      DependenciesManager.Dependencies,
      options.install,
      options.dryRun
    );

    // emit config files
    await this.generator.generate(
      (options.lib
        ? TemplateGenerator.Files
        : TemplateGenerator.CommonFiles
      ).map((f) => f.name),
      options.dryRun
    );

    // install git hooks
    await this.hooksManager.install(options.dryRun);

    // install commitizen adapter
    await this.installCommitizenAdapter(options.dryRun);

    // add npm scripts
    await this.scriptsManager.add(ScriptsManager.Scripts, options.dryRun);

    const finish = (Date.now() - start) / 1000;

    logger.log(line());
    logger.log(
      `🔎 run ${chalk.green(snip("npm run lint:fix"))} to lint everything`
    );
    logger.log(
      `🧹 run ${chalk.green(snip("npm run format:fix"))} to format everything`
    );
    logger.log(line());
    logger.log(
      `💡 you should probably add ${chalk.green(
        snip("npm test && npm run build")
      )} to your pre-commit hook to make sure each commit builds :)`
    );
    logger.log(line());
    logger.log(`🪄✨ finished setup in ${finish.toFixed(1)}s 🚀`);
  }

  private async installCommitizenAdapter(dryRun: boolean | undefined) {
    const loader = createLoader("installing commitizen adapter");
    loader.start();

    if (!dryRun) await exec("npx commitizen init cz-conventional-changelog");

    loader.succeed("done installing commitizen adapter");
  }

  private async isGitInitialized() {
    if (!fs.existsSync(path.join(process.cwd(), ".git"))) {
      throw new CliError.Fatal(
        `Could not find git repository, run ${chalk.green(
          snip("git init")
        )} and try again`
      );
    }
    try {
      await getCurrentBranch();
    } catch (error) {
      throw new CliError.Warn(
        `No git branch found, make an initial commit to get started`
      );
    }
  }
}

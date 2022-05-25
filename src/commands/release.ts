import chalk from "chalk";
import { getCurrentBranch, pushWithTags } from "../utils/git";
import { bumpVersion } from "../utils/bump";
import { BaseOptions, Program, SubCommand } from "./base";
import { InvalidOptionArgumentError } from "commander";
import { validateReleaseBranch } from "../utils/branch";
import { quot, snip } from "../utils/snippets";
import { createLoader } from "../utils/loader";

export interface Options extends BaseOptions {
  force: boolean;
  push: boolean;
  as?: string;
  preRelease?: true;
  tag?: string;
}

export class ReleaseCommand extends SubCommand {
  public command = "release";

  public setup(program: Program) {
    return program
      .description("make a release (bump version, tag commit and push changes)")
      .option("-f --force", "force release when not in a CI environment", false)
      .option(
        "-a --as <type>",
        "release with a specific version type",
        this.parseReleaseType
      )
      .option("--no-push", "prevent pushing changes and tags to remote");
  }

  public async action(options: Options) {
    const branch = await getCurrentBranch();

    // check the current branch before releasing
    validateReleaseBranch(branch, options.force);

    // bump version
    if (options.preRelease) {
      await bumpVersion({
        dryRun: options.dryRun,
        releaseAs: options.as,
        preRelease: options.preRelease,
        preReleaseTag: options.tag,
      });
    } else {
      await bumpVersion({
        dryRun: options.dryRun,
        releaseAs: options.as,
      });
    }

    // push changes
    await this.push(options.push, options.force, options.dryRun);
  }

  private async push(
    push: boolean,
    force: boolean,
    dryRun: boolean | undefined
  ) {
    const loader = createLoader("pushing changes with tags").start();

    if (push) {
      await pushWithTags(force, dryRun);
      loader.succeed("successfully pushed changes and tags");
    } else {
      loader.info(`run ${chalk.green(snip("reflow push"))} to push changes`);
    }
  }

  protected parseReleaseType(value: string) {
    const validReleaseTypes = ["major", "minor", "patch"];

    if (!validReleaseTypes.includes(value)) {
      throw new InvalidOptionArgumentError(
        `${quot(value)} is not one of ${chalk.green(
          validReleaseTypes.join(", ")
        )}`
      );
    }
    return value;
  }
}

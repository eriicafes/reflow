import { config } from "../utils/config";
import {
  getWorkingBranches,
  getCurrentBranch,
  mergeBranchToMain,
} from "../utils/git";
import { logger } from "../utils/logger";
import { prompt } from "../utils/prompt";
import { BaseOptions, Program, SubCommand } from "./base";

interface Options extends BaseOptions {
  preferFastForward: boolean;
}

export class MergeCommand extends SubCommand {
  public command = "merge";

  public setup(program: Program) {
    return program
      .description("merge working branch to main branch")
      .option("--prefer-ff", "always perform a fast-foward merge", false);
  }

  public async action(options: Options) {
    const branch = await getCurrentBranch();

    if (branch === config.mainBranch) {
      const workingBranches = await getWorkingBranches();

      if (!workingBranches.length) {
        logger.log("No working branches available");
        return;
      }

      const { targetBranch, proceed, deleteOnSuccess } = await prompt([
        {
          type: "list",
          name: "targetBranch",
          message: `Which branch do you want to merge to ${config.mainBranch}`,
          choices: workingBranches,
        },
        {
          type: "confirm",
          name: "proceed",
          message: (ctx) =>
            `Do you really want to merge ${ctx.targetBranch} to ${config.mainBranch}`,
        },
        {
          type: "confirm",
          name: "deleteOnSuccess",
          message: "Delete this branch after a successful merge",
          default: false,
          when: (ctx) => ctx.proceed,
        },
      ]);

      if (proceed)
        await this.merge({
          targetBranch,
          deleteOnSuccess,
          preferFastForward: options.preferFastForward,
          dryRun: options.dryRun,
        });
    } else {
      const { proceed, deleteOnSuccess } = await prompt([
        {
          type: "confirm",
          name: "proceed",
          message: `Do you want to merge ${branch} branch to ${config.mainBranch}`,
        },
        {
          type: "confirm",
          name: "deleteOnSuccess",
          message: "Delete this branch after a successful merge",
          default: false,
          when: (ctx) => ctx.proceed,
        },
      ]);

      if (proceed)
        await this.merge({
          targetBranch: branch,
          deleteOnSuccess,
          preferFastForward: options.preferFastForward,
          dryRun: options.dryRun,
        });
    }
  }

  private async merge(options: {
    targetBranch: string;
    deleteOnSuccess: boolean;
    preferFastForward: boolean;
    dryRun?: boolean;
  }) {
    await mergeBranchToMain(
      options.targetBranch,
      {
        deleteOnSuccess: options.deleteOnSuccess,
        preferFastForward: options.preferFastForward,
      },
      options.dryRun
    );
  }
}

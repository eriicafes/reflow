import { isValidBranch } from "../utils/branch";
import { config } from "../utils/config";
import { prompt } from "../utils/prompt";
import { checkoutNewBranch, renameCurrentBranch } from "../utils/git";
import { BaseOptions, OptionalArg, Program, SubCommand } from "./base";

interface Options extends BaseOptions {
  rename?: boolean;
}

export class BranchCommand extends SubCommand {
  public command = "branch";

  public setup(program: Program) {
    return program
      .description(
        "create and checkout new branch or rename the current branch"
      )
      .argument("[name]", "branch name")
      .argument(
        "[parent]",
        "parent branch to base new branch (not applicable with rename)"
      )
      .option("-r --rename", "rename branch");
  }

  public async action(
    name: OptionalArg,
    parent: OptionalArg,
    options: Options
  ) {
    let newBranchName: string;

    if (name && isValidBranch(name)) {
      newBranchName = name;
    } else {
      const { type, branchName } = await prompt([
        {
          type: "list",
          name: "type",
          message: options.rename
            ? "What type of branch is this?"
            : "What are you going to be working on?",
          choices: config.allowedBranches,
        },
        {
          name: "branchName",
          message: "Give this branch a name",
          default: () =>
            name
              ?.split("/")
              .filter((c) => c)
              .join("-"),
          transformer: (val, ctx) => ctx.type + "/" + val,
          validate: (val) => (val ? true : "Branch name is required"),
        },
      ]);

      newBranchName = type + "/" + branchName;
    }

    if (options.rename) {
      await renameCurrentBranch(newBranchName, options.dryRun);
    } else {
      await checkoutNewBranch(newBranchName, parent, options.dryRun);
    }
  }
}

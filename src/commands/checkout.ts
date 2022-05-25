import { config } from "../utils/config";
import { prompt } from "../utils/prompt";
import { checkoutBranch, getWorkingBranches } from "../utils/git";
import { BaseOptions, OptionalArg, Program, SubCommand } from "./base";
import { CliError } from "../utils/error";

interface Options extends BaseOptions {}

export class CheckoutCommand extends SubCommand {
  public command = "checkout";

  public setup(program: Program) {
    return program
      .description("checkout existing branch")
      .argument("[search]", "filter branches by type");
  }

  public async action(search: OptionalArg, options: Options) {
    let branches = await getWorkingBranches();

    // If search matches a branch checkout at once
    const exactSearch = branches
      .concat(config.mainBranch)
      .find((b) => b === search);
    if (exactSearch) {
      await checkoutBranch(exactSearch, options.dryRun);
      return;
    }

    // Filter the branches by search
    if (search) branches = branches.filter((b) => b.startsWith(search));

    // If no branches found
    if (!branches.length) {
      if (search) {
        // Check if any allowed branches was matched
        const possibleBranches = config.allowedBranches.filter((b) =>
          b.startsWith(search)
        );

        // Fail only when filter result is empty as a result of an unknown branch search
        // This happens when the provided search does not match any allowed branch
        if (!possibleBranches.length) {
          throw new CliError.Info(`No ${search} branch found`);
        }

        // Compose search types string
        const last = possibleBranches.pop();
        const searchedTypes = possibleBranches.length
          ? possibleBranches.join(", ") + " or " + last
          : last;

        throw new CliError.Info(`No ${searchedTypes} branch found`);
      } else {
        throw new CliError.Info("No working branch found");
      }
    }

    const { branch } = await prompt([
      {
        type: "list",
        name: "branch",
        message: "Which branch would you like to checkout",
        choices: [config.mainBranch, ...branches],
      },
    ]);

    await checkoutBranch(branch, options.dryRun);
  }
}

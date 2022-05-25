import { getCurrentBranch } from "../utils/git";
import { validateCommitBranch } from "../utils/branch";
import { Program, SubCommand } from "./base";
import { CliError } from "../utils/error";

export class PreCommitCommand extends SubCommand {
  public command = "pre-commit";

  protected allowDryRun = false;

  public setup(program: Program) {
    return program.description("validate commit branch");
  }

  public async action() {
    const branch = await getCurrentBranch();

    try {
      validateCommitBranch(branch);
    } catch (e) {
      if (!CliError.Info.isInstance(e)) throw e;
    }
  }
}

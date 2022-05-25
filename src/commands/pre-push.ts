import { getCurrentBranch, pullAndRebaseMainFromRemote } from "../utils/git";
import { config } from "../utils/config";
import { Program, SubCommand } from "./base";

export class PrePushCommand extends SubCommand {
  public command = "pre-push";

  protected allowDryRun = false;

  public setup(program: Program) {
    return program.description("prepare main branch for push");
  }

  public async action() {
    const branch = await getCurrentBranch();

    // Only run when pushing from main branch
    if (branch === config.mainBranch) {
      await pullAndRebaseMainFromRemote();
    }
  }
}

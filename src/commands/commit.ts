import path from "path";
import { Program, SubCommand } from "./base";

export class CommitCommand extends SubCommand {
  public command = "commit";

  protected allowDryRun = false;

  public setup(program: Program) {
    return program
      .description("compose commit message")
      .option("--retry", "retry last commit attempt");
  }

  public async action() {
    // remove command name from argv which is at index 2
    // commitizen expects it's arguments to start from index 2
    // so removing the command name from argv will shift the rest arguments to start at index 2
    process.argv.splice(2, 1);

    // pass allowed arguments to commitizen
    require("commitizen/dist/cli/git-cz").bootstrap(
      {
        cliPath: path.join(process.cwd(), "node_modules", "commitizen"),
      },
      process.argv
    );
  }
}

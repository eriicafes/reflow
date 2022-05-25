import { pushWithTags } from "../utils/git";
import { BaseOptions, Program, SubCommand } from "./base";

interface Options extends BaseOptions {
  dryRun: undefined;
  force?: boolean;
}

export class PushCommand extends SubCommand {
  public command = "push";

  protected allowDryRun = false;

  public setup(program: Program) {
    return program
      .description("push changes with tags")
      .option("-f --force", "force push");
  }

  public async action(options: Options) {
    await pushWithTags(options.force);
  }
}

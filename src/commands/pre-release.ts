import { Program } from "./base";
import { Options, ReleaseCommand } from "./release";

export class PreReleaseCommand extends ReleaseCommand {
  public command = "prerelease";

  public setup(program: Program) {
    return program
      .description("make a pre-release (eg. v1.0.1-{tag}.0)")
      .option("-t --tag <name>", "pre-release tag")
      .option(
        "--as <type>",
        "release with a specific version type",
        this.parseReleaseType
      )
      .option("--no-push", "prevent pushing changes and tags to remote");
  }

  public async action(options: Options) {
    return super.action({
      dryRun: options.dryRun,
      force: true,
      push: options.push,
      as: options.as,
      preRelease: true,
      tag: options.tag,
    });
  }
}

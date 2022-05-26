import { exec } from "./exec";
import { createLoader } from "./loader";

export type Script = { key: string; value: string };

export class ScriptsManager {
  public static Scripts: Script[] = [
    { key: "prepare", value: "husky install" },
    { key: "commit", value: "cz" },
    { key: "lint", value: "eslint ." },
    { key: "lint:fix", value: "eslint . --fix" },
    { key: "format", value: "prettier . --check" },
    { key: "format:fix", value: "prettier . --write" },
  ];

  public async add(scripts: Script[], dryRun: boolean | undefined) {
    if (!scripts.length) return;

    // prepare operations
    const operations = scripts.map(
      (script) => () => exec(`npm set-script ${script.key} "${script.value}"`)
    );

    const loader = createLoader("adding npm scripts");
    loader.start();

    // skip if dry run
    if (!dryRun) {
      // call set-script one after the other
      for (let operation of operations) {
        await operation()
      }
    }

    loader.succeed("done adding npm scripts");
  }
}

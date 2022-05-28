import fs from "fs";
import path from "path";
import util from "util";
import * as husky from "husky";
import chalk from "chalk";
import { prepareWrite } from "./write";
import { createLoader } from "./loader";
import { ROOT_DIR } from "./config";

const readfile = util.promisify(fs.readFile);

type Hook = {
  file: string;
  source: string;
};
export class HooksManager {
  public static Hooks: Hook[] = [
    { file: "commit-msg", source: "templates/hooks/commit-msg" },
    { file: "pre-commit", source: "templates/hooks/pre-commit" },
    { file: "pre-push", source: "templates/hooks/pre-push" },
  ];

  public async install(dryRun: boolean | undefined) {
    // store and disable console log to prevent husky logs
    const consoleLog = console.log.bind(console);
    console.log = () => {};

    if (!dryRun) husky.install();

    const hooksToInstall = await prepareWrite({
      files: HooksManager.Hooks,
      dest: ({ file }) => `.husky/${file}`,
      onDuplicate: ({ file }) =>
        `${chalk.cyan(file)} already exists ${chalk.dim(
          `(.husky/${file})`
        )}, do you want to append to this hook?`,
    });
    if (!hooksToInstall.length) return;

    // prepare operations
    const operations = hooksToInstall.map((hook) => async () => {
      // get file contents
      const contents = await readfile(path.join(ROOT_DIR, hook.source), {
        encoding: "utf-8",
      });

      // create hook file using husky
      husky.add(`.husky/${hook.file}`, contents);
    });
    
    const loader = createLoader("installing git hooks");
    loader.start();
    
    if (!dryRun) await Promise.all(operations.map((fn) => fn()));
    
    // restore logs
    console.log = consoleLog;

    loader.succeed("done installing git hooks");
  }
}

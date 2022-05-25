import chalk from "chalk";
import fs from "fs";
import path from "path";
import util from "util";
import { ROOT_DIR } from "./config";
import { CliError } from "./error";
import { createLoader } from "./loader";
import { quot } from "./snippets";
import { prepareWrite } from "./write";

const copyfile = util.promisify(fs.copyFile);
const mkdir = util.promisify(fs.mkdir);

export type File = {
  name: string;
  source: string;
  dest: string;
};

export class TemplateGenerator {
  public static CommonFiles: File[] = [
    {
      name: "actions/test",
      source: "templates/actions/test.yml",
      dest: ".github/workflows/test.yml",
    },
    {
      name: "actions/version",
      source: "templates/actions/version.yml",
      dest: ".github/workflows/version.yml",
    },
    {
      name: "config/prettier",
      source: "templates/config/.prettierrc.json",
      dest: ".prettierrc.json",
    },
    {
      name: "config/eslint",
      source: "templates/config/.eslintrc.json",
      dest: ".eslintrc.json",
    },
    {
      name: "config/commitlint",
      source: "templates/config/.commitlintrc.json",
      dest: ".commitlintrc.json",
    },
    {
      name: "config/lint-staged",
      source: "templates/config/.lintstagedrc.json",
      dest: ".lintstagedrc.json",
    },
  ];

  public static AdditionalFiles: File[] = [
    {
      name: "actions/release",
      source: "templates/actions/release.yml",
      dest: ".github/workflows/release.yml",
    },
    {
      name: "actions/publish",
      source: "templates/actions/publish.yml",
      dest: ".github/workflows/publish.yml",
    },
    {
      name: "config/version",
      source: "templates/config/.versionrc.json",
      dest: ".versionrc.json",
    },
    {
      name: "config/reflow",
      source: "templates/config/.reflowrc.json",
      dest: ".reflowrc.json",
    },
  ];

  public static Files: File[] = [...this.CommonFiles, ...this.AdditionalFiles];

  public async generate(files: string[], dryRun: boolean | undefined) {
    const templateFiles = files.map((file) => this.getTemplate(file));

    const filesToWrite = await prepareWrite({
      files: templateFiles,
      dest: "dest",
      onDuplicate: ({ name, dest }) =>
        `${chalk.cyan(name)} already exists ${chalk.dim(
          `(${dest})`
        )}, do you want to overwrite the existing file?`,
    });
    if (!filesToWrite.length) return;

    // prepare operations
    const operations = filesToWrite.map((file) => () => this.write(file));

    const loader = createLoader("generating files");
    loader.start();

    // skip if dry run
    if (!dryRun) await Promise.all(operations.map((fn) => fn()));

    loader.succeed("done generating files");
  }

  public async write(file: File) {
    const source = path.join(ROOT_DIR, file.source);
    const dest = path.join(process.cwd(), file.dest);

    if (!fs.existsSync(path.dirname(dest))) {
      await mkdir(path.dirname(path.join(process.cwd(), file.dest)), {
        recursive: true,
      });
    }

    await copyfile(source, dest);
  }

  public getTemplate(file: string) {
    const templateFile = TemplateGenerator.Files.find((f) => f.name === file);

    if (!templateFile)
      throw new CliError.Warn(`Template ${chalk.cyan(quot(file))} not found`);

    return templateFile;
  }
}

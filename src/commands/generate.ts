import chalk from "chalk";
import { CliError } from "../utils/error";
import { File, TemplateGenerator } from "../utils/generator";
import { prompt } from "../utils/prompt";
import { quot } from "../utils/snippets";
import { BaseOptions, OptionalArg, Program, SubCommand } from "./base";

interface Options extends BaseOptions {
  all?: boolean;
  common?: boolean;
}

export class GenerateCommand extends SubCommand {
  public command = "generate [type] [file]";

  public setup(program: Program) {
    return program
      .description("generate template files")
      .option("-c --common", "generate all common template files")
      .option("-a --all", "generate all template files");
  }

  public async action(type: OptionalArg, file: OptionalArg, options: Options) {
    const generator = new TemplateGenerator();

    // generate all template files if all flag is present
    if (options.all) {
      return await generator.generate(
        TemplateGenerator.Files.map((f) => f.name),
        options.dryRun
      );
    } else if (options.common) {
      return await generator.generate(
        TemplateGenerator.CommonFiles.map((f) => f.name),
        options.dryRun
      );
    }

    // if both type and file are provided, proceed to generate
    if (type && file) {
      return await generator.generate([`${type}/${file}`], options.dryRun);
    }

    // get template files and filter by type if provided
    const filteredFiles = TemplateGenerator.Files.filter((f) =>
      type ? f.name.startsWith(type) : true
    );

    // throw error if no files match provided type
    if (!filteredFiles.length && type) {
      throw new CliError.Info(
        `Template files ${chalk.cyan(quot(type))} not found`
      );
    }

    // if only one template file matches, proceed to generate
    if (filteredFiles.length === 1) {
      const exactTemplateFile = filteredFiles[0] as File;
      return await generator.generate([exactTemplateFile.name], options.dryRun);
    }

    // prompt user to select matched template files to generate
    const { files } = await prompt([
      {
        name: "files",
        type: "checkbox",
        choices: filteredFiles.map((f) => f.name),
        validate: (ctx) => (ctx.length ? true : "Please select a template"),
      },
    ]);

    await generator.generate(files, options.dryRun);
  }
}

import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { prompt } from "./prompt";

export type Options<T> = {
  files: T[];
  dest: (keyof T & string) | ((file: T) => string);
  onDuplicate: (file: T) => string;
};

export async function prepareWrite<T extends { [k: string]: any }>({
  files,
  dest,
  onDuplicate,
}: Options<T>): Promise<T[]> {
  const getDest = (file: T) =>
    typeof dest === "string" ? file[dest] : dest(file);

  const fileWrites: T[] = [];

  let savedOverwrite: boolean | undefined = undefined;

  for (const [index, file] of files.entries()) {
    const fileExists = fs.existsSync(path.join(process.cwd(), getDest(file)));

    if (fileExists) {
      if (savedOverwrite !== undefined) {
        if (savedOverwrite) fileWrites.push(file);
      } else {
        const remaining = files.slice(index + 1).length;

        const { overwritePair } = await prompt([
          {
            name: "overwritePair",
            message: onDuplicate(file),
            type: "list",
            choices: [
              {
                name: "No",
                value: [false, false],
              },
              {
                name: "Yes",
                value: [true, false],
              },
              ...(remaining < 1
                ? []
                : [
                    new inquirer.Separator(),
                    {
                      name: `No (Do this for remaining ${remaining})`,
                      value: [false, true],
                      disabled: remaining < 1,
                    },
                    {
                      name: `Yes (Do this for remaining ${remaining})`,
                      value: [true, true],
                      disabled: remaining < 1,
                    },
                  ]),
            ],
          },
        ]);

        const [overwrite, saveOption] = overwritePair;

        if (saveOption) savedOverwrite = overwrite; // save overwrite options for future prompts
        if (overwrite) fileWrites.push(file);
      }
    } else {
      fileWrites.push(file);
    }
  }

  return fileWrites;
}

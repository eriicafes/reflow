import chalk from "chalk";
import { line, logger } from "./logger";

export const isString = (val: any, path: string) => {
  if (typeof val === "string") return val;
  else
    throw new Error(
      `Expected string but got ${typeof val} in ${chalk.yellow(path)}`
    );
};

export const isStringArray = (val: any, path: string) => {
  if (Array.isArray(val)) {
    return val.map((v, i) => isString(v, `${path}[${i}]`));
  } else
    throw new Error(
      `Expected string array but got ${typeof val} in ${chalk.yellow(path)}`
    );
};

export const isBoolean = (val: any, path: string) => {
  if (typeof val === "boolean") return val;
  else
    throw new Error(
      `Expected boolean but got ${typeof val} in ${chalk.yellow(path)}`
    );
};

export function validateAndMergeConfig<T extends Record<string, any>>(
  defaultConfig: T,
  loadedConfig: Record<string, any>,
  validate: { [K in keyof T]: (val: any, path: string) => T[K] }
) {
  const resolvedConfig = { ...defaultConfig };

  try {
    Object.keys(resolvedConfig).forEach((key) => {
      if (loadedConfig[key]) {
        resolvedConfig[key as keyof T] = validate[key as keyof T](
          loadedConfig[key],
          key
        );
      }
    });

    return resolvedConfig;
  } catch (err: any) {
    logger.for("Invalid Config").warn(line() + line() + err.message);

    process.exit(1);
  }
}

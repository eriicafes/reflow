import fs from "fs";
import path from "path";
// @ts-ignore
import { getConfiguration } from "standard-version/lib/configuration.js";
import { loadConfig } from "./config-loader";
import {
  isBoolean,
  isString,
  isStringArray,
  validateAndMergeConfig,
} from "./validate";

export const ROOT_DIR = path.resolve(__dirname, "..", "..");
export const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json");
export const packageJson = JSON.parse(
  fs.readFileSync(PACKAGE_JSON_PATH, "utf-8")
);

export const standardVersionConfig = getConfiguration();

const defaultConfig = {
  mainBranch: "main",
  remote: "origin",
  branchDelimeter: "/",
  allowedBranches: [
    "feature",
    "fix",
    "chore",
    "refactor",
    "build",
    "style",
    "docs",
    "test",
  ],
  keepMergeCommits: true,
};

const loadedConfig = loadConfig(packageJson.name.split("/").pop());

const resolvedConfig = validateAndMergeConfig(defaultConfig, loadedConfig, {
  mainBranch: isString,
  remote: isString,
  branchDelimeter: isString,
  allowedBranches: isStringArray,
  keepMergeCommits: isBoolean,
});

export const config = {
  name: packageJson.name.split("/").pop() as string,
  version: packageJson.version as string,
  description: packageJson.description as string,
  ...resolvedConfig,
};

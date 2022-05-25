import { config } from "./config";
import chalk from "chalk";
import { CliError } from "./error";
import { quot, snip } from "./snippets";
import { isCI } from "ci-info";
import { createLoader } from "./loader";

export const isValidBranchType = (
  type: string | undefined,
  allowedBranchTypes?: string[]
): type is string => {
  if (!type) return false;
  if ((allowedBranchTypes || config.allowedBranches).includes(type))
    return true;
  return false;
};

export const isValidBranch = (
  branch: string | undefined,
  allowedBranchTypes?: string[]
): branch is string => {
  if (!branch) return false;

  const [type, ...details] = branch.split(config.branchDelimeter);

  // Only valid if branch is in the exact format we want and has a valid branch type
  if (details.length === 1 && isValidBranchType(type, allowedBranchTypes))
    return true;

  return false;
};

const randomBranch = () => {
  const index = Math.floor(Math.random() * config.allowedBranches.length);
  return (
    config.allowedBranches[index] +
    config.branchDelimeter +
    "details-about-commit"
  );
};

const branchExample = `eg. ${chalk.cyanBright(quot(randomBranch()))}`;
const delimeterExample = chalk.cyanBright(quot(config.branchDelimeter));
const supportedExample = chalk.cyanBright(config.allowedBranches);

export const validateCommitBranch = (branch: string): [string, string] => {
  const [type, details, ...unwanted] = branch.split(config.branchDelimeter);

  const loader = createLoader("validating commit branch").start();

  // do not allow commits into main branch
  if (branch === config.mainBranch) {
    loader.warn(
      `commits into ${chalk.green(quot(config.mainBranch))} are not allowed`
    );
    loader.info(
      `consider checking out ${chalk.green(
        quot(config.mainBranch)
      )} to a working branch`
    );
    loader.info(
      `run ${chalk.green(snip(`reflow branch`))} to checkout a working branch`
    );
    loader.fail("commit aborted");

    throw new CliError.Info(
      `Commits into ${chalk.green(quot(config.mainBranch))} are not allowed`
    );
  }

  // do not allow commits from branch without a delimeter in branch name
  if (!details) {
    loader.warn(`unsupported commit branch ${chalk.yellow(quot(branch))}`);
    loader.info(
      `branch name should contain a ${delimeterExample} to show branch type ${branchExample}`
    );
    loader.info(
      `run ${chalk.green(snip("reflow branch -r"))} to rename this branch`
    );
    loader.fail("commit aborted");

    throw new CliError.Info(
      `Unsupported commit branch ${chalk.yellow(quot(branch))}`
    );
  }

  // do not allow commits from branch with more than one delimeter in branch name
  if (unwanted.length) {
    loader.warn(`unsupported commit branch ${chalk.yellow(quot(branch))}`);
    loader.info(
      `branch name should contain only one ${delimeterExample} ${branchExample}`
    );
    loader.info(
      `run ${chalk.green(snip("reflow branch -r"))} to rename this branch`
    );
    loader.fail("commit aborted");

    throw new CliError.Info(
      `Unsupported commit branch ${chalk.yellow(quot(branch))}`
    );
  }

  // do not allow commits from branch with an unknown type
  if (!isValidBranchType(type)) {
    loader.warn(`unsupported commit branch ${chalk.yellow(quot(branch))}`);
    loader.info(
      `supported branches are prefixed with: ${supportedExample} ${branchExample}`
    );
    loader.info(
      `run ${chalk.green(snip("reflow branch -r"))} to rename this branch`
    );
    loader.fail("commit aborted");

    throw new CliError.Info(
      `Unsupported commit branch ${chalk.yellow(quot(branch))}`
    );
  }

  loader.succeed(`ready to commit ${chalk.cyan(type)} ${details}`);

  return [type, details];
};

export const validateReleaseBranch = (branch: string, force: boolean) => {
  const loader = createLoader("validating release branch").start();

  // only allow release from main branch
  if (branch !== config.mainBranch) {
    loader.warn(`unsupported release branch ${chalk.yellow(quot(branch))}`);
    loader.info(
      `consider merging this branch to ${chalk.green(
        quot(config.mainBranch)
      )} before releasing`
    );
    loader.info(
      `run ${chalk.green(snip("reflow merge"))} to merge this branch`
    );
    loader.fail("release aborted");

    throw new CliError.Info(
      `Unsupported release branch ${chalk.yellow(quot(branch))}`
    );
  }

  // throw error if release is called in non-ci environment without force flag
  if (!isCI && !force) {
    loader.warn(`unsupported environment`);
    loader.info(
      `release should be run in a CI environment, to override the default behaviour retry release with the -f option`
    );
    loader.fail("release aborted");

    throw new CliError.Info("Unsupported environment");
  }

  loader.succeed(`ready to release ${chalk.cyan(branch)}`);
};

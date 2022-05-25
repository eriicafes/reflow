import { exec, spawn } from "./exec";
import { prompt } from "./prompt";
import { config } from "./config";
import { createLoader } from "./loader";
import chalk from "chalk";
import { CliError } from "./error";

export const getCurrentBranch = async () => {
  const { stdout } = await exec("git rev-parse --abbrev-ref HEAD");

  return stdout.trim();
};

export const getWorkingBranches = async () => {
  const { stdout } = await exec("git branch");

  const branches = stdout
    .trim()
    .split("\n")
    .map((b) => b.replace("*", "").trim())
    .filter((b) => b !== config.mainBranch);

  return branches;
};

export const checkoutBranch = async (branch: string, dryRun?: boolean) => {
  const currentBranch = await getCurrentBranch();
  if (branch === currentBranch) return currentBranch;

  const loader = createLoader(
    `checking out branch ${chalk.cyanBright(branch)}`
  ).start();

  try {
    if (!dryRun) await exec(`git checkout ${branch}`);
    loader.succeed(`switched to branch ${chalk.cyanBright(branch)}`);

    return currentBranch;
  } catch (e: any) {
    loader.fail("checkout failed");
    throw new CliError.Git(e.message);
  }
};

export const checkoutNewBranch = async (
  branch: string,
  parent?: string,
  dryRun?: boolean
) => {
  const loader = createLoader(
    `creating and checking out branch ${chalk.cyanBright(branch)}` +
      (parent ? ` off ${parent}` : "")
  ).start();

  try {
    if (!dryRun)
      await exec(`git checkout -b ${branch}` + (parent ? ` ${parent}` : ""));
    loader.succeed(`switched to new branch ${chalk.cyanBright(branch)}`);
  } catch (e: any) {
    loader.fail("checkout failed");
    throw new CliError.Git(e.message);
  }
};

export const renameCurrentBranch = async (name: string, dryRun?: boolean) => {
  const loader = createLoader(
    `renaming branch to ${chalk.cyanBright(name)}`
  ).start();

  try {
    if (!dryRun) await exec(`git branch -m ${name}`);
    loader.succeed();
  } catch (e: any) {
    loader.fail("rename failed");
    throw new CliError.Git(e.message);
  }
};

export const deleteBranch = async (name: string, dryRun?: boolean) => {
  const loader = createLoader(
    `deleting branch ${chalk.cyanBright(name)}`
  ).start();

  try {
    if (!dryRun) await exec(`git branch -d ${name}`);
    loader.succeed();
  } catch (e: any) {
    loader.fail("delete failed");
    throw new CliError.Git(e.message);
  }
};

export const pullAndRebaseMainFromRemote = async (dryRun?: boolean) => {
  const loader = createLoader("pulling changes from remote").start();

  try {
    await checkoutBranch(config.mainBranch, dryRun);
    if (!dryRun) await exec(`git pull --rebase ${config.remote}`);
    loader.succeed();
  } catch (e: any) {
    loader.fail("pull changes from remote failed");
    throw new CliError.Git(e.message);
  }
};

export const pullAndRebaseFromMain = async (
  branch: string,
  dryRun?: boolean
) => {
  const loader = createLoader(
    `rebasing ${chalk.cyanBright(branch)} onto ${chalk.cyanBright(
      config.mainBranch
    )}`
  ).start();

  try {
    await pullAndRebaseMainFromRemote(dryRun);
    if (!dryRun) await exec(`git rebase ${config.mainBranch} ${branch}`);
    loader.succeed();
  } catch (e: any) {
    loader.fail(`rebase onto ${chalk.cyanBright(config.mainBranch)} failed`);
    throw new CliError.Git(e.message);
  }
};

export const mergeBranchToMain = async (
  targetBranch: string,
  options: { preferFastForward: boolean; deleteOnSuccess: boolean },
  dryRun?: boolean
) => {
  const loader = createLoader(
    `merging ${chalk.cyanBright(targetBranch)} into ${chalk.cyanBright(
      config.mainBranch
    )}`
  ).start();

  try {
    const previousBranch = await getCurrentBranch();

    await pullAndRebaseFromMain(targetBranch, dryRun);

    await checkoutBranch(config.mainBranch, dryRun);

    // Perform a fast-forward merge if merge commit is turned off in config or prefer fast forward flag is present
    if (!dryRun)
      await spawn(
        `git merge ${targetBranch} ${
          !config.keepMergeCommits || options.preferFastForward
            ? "--ff-only"
            : "--no-ff"
        }`
      );

    loader.succeed(
      `merged ${chalk.cyanBright(targetBranch)} into ${chalk.cyanBright(
        config.mainBranch
      )}`
    );

    // Delete merged branch if should delete on success
    if (options.deleteOnSuccess) await deleteBranch(targetBranch, dryRun);

    // Return back to current branch if branch was not deleted
    if (!options.deleteOnSuccess && previousBranch !== config.mainBranch)
      await checkoutBranch(previousBranch, dryRun);
  } catch (e: any) {
    loader.fail(
      `merge ${chalk.cyanBright(targetBranch)} into ${chalk.cyanBright(
        config.mainBranch
      )} failed`
    );
    throw new CliError.Git(e.message);
  }
};

export const pushWithTags = async (force?: boolean, dryRun?: boolean) => {
  const loader = createLoader("pushing changes with tags").start();
  const forceCommand = " -f --force-with-lease --force-if-includes";

  try {
    const currentBranch = await getCurrentBranch();

    if (!dryRun)
      await exec("git push --follow-tags" + (force ? forceCommand : "")).catch(
        async (e: any) => {
          if (e.stderr.includes("no upstream branch")) {
            loader.info("this branch does not have an upstream branch set");

            const { remote, branch } = await prompt([
              {
                name: "remote",
                message:
                  "Enter remote repository tracking your local repository",
                default: config.remote,
              },
              {
                name: "branch",
                message: "Enter remote branch to track local branch",
                default: currentBranch,
              },
            ]);

            return await exec(
              `git push --set-upstream ${remote} ${branch} --follow-tags` +
                (force ? forceCommand : "")
            )
              .then(() => {
                loader.succeed(
                  `${chalk.cyanBright(
                    currentBranch
                  )} set to track ${chalk.cyanBright(
                    remote
                  )} ${chalk.cyanBright(branch)}`
                );
              })
              .catch((err) => {
                loader.fail("unable to set upstream and push changes");
                throw err;
              });
          }
          throw e;
        }
      );

    loader.succeed("pushed changes with tags");
  } catch (e: any) {
    loader.fail("push failed");
    throw new CliError.Git(e.message);
  }
};

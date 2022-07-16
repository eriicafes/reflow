import chalk from "chalk";
import { CliError } from "./error";
import { createLoader } from "./loader";
import { PackageManager, Manager, NpmManager, Package } from "./managers";
import { prompt } from "./prompt";
import { snip } from "./snippets";

export class DependenciesManager {
  public static DevDependencies: Package<true>[] = [
    // comittizen
    {
      name: "commitizen",
      version: "latest",
      dev: true,
    },
    {
      name: "cz-conventional-changelog",
      version: "latest",
      dev: true,
    },
    // commitlint
    {
      name: "@commitlint/cli",
      version: "latest",
      dev: true,
    },
    {
      name: "@commitlint/config-conventional",
      version: "latest",
      dev: true,
    },
    // eslint
    {
      name: "eslint",
      version: "latest",
      dev: true,
    },
    {
      name: "@typescript-eslint/eslint-plugin",
      version: "latest",
      dev: true,
    },
    {
      name: "@typescript-eslint/parser",
      version: "latest",
      dev: true,
    },
    // prettier
    {
      name: "prettier",
      version: "latest",
      dev: true,
    },
    {
      name: "pretty-quick",
      version: "latest",
      dev: true,
    },
    // lint-staged
    {
      name: "lint-staged",
      version: "latest",
      dev: true,
    },
    // husky
    {
      name: "husky",
      version: "latest",
      dev: true,
    },
  ];

  public static ProdDependencies: Package<false>[] = [];

  public static Dependencies: Package[] = [
    ...DependenciesManager.DevDependencies,
    ...DependenciesManager.ProdDependencies,
  ];

  public async install(
    packages: Package[],
    install: boolean,
    dryRun: boolean | undefined
  ) {
    if (!packages.length) return;

    const { proceed, manager } = (await prompt([
      {
        type: "confirm",
        name: "proceed",
        message: `Proceeding will install the following ${
          packages.length
        } packages: \n ${packages
          .map((p) => "\n\t" + p.name + "@" + p.version)
          .join("")} \n\n continue?`,
      },
      {
        type: "list",
        name: "manager",
        message: `Which package manager do you want to use?`,
        choices: ["npm", "yarn"] as Manager[],
        when: (ctx) => ctx.proceed,
      },
    ])) as { proceed: boolean; manager: Manager };

    // cancel install
    if (!proceed) throw new CliError.Info("Install was aborted");

    const packageManager = this.getPackageManager(manager);

    const loader = createLoader(
      `installing ${packages.length} packages using ${packageManager.binary}`
    );
    loader.start();

    if (install) {
      // skip if dry run
      if (!dryRun) await packageManager.install(packages);
    } else {
      const { dev, prod } = packageManager.group(packages);
      if (dev.length)
        loader.info(
          `run ${chalk.green(
            snip(packageManager.getInstallCommand(dev, true))
          )}`
        );
      if (prod.length)
        loader.info(
          `run ${chalk.green(
            snip(packageManager.getInstallCommand(prod, false))
          )}`
        );
    }

    loader.succeed("done installing dependencies");
  }

  private getPackageManager(manager: Manager): PackageManager {
    switch (manager) {
      case "npm":
        return new NpmManager();
      default:
        return new NpmManager();
    }
  }
}

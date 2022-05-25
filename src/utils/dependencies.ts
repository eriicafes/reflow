import chalk from "chalk";
import { createLoader } from "./loader";
import { BasePackageManager, NpmManager, Package } from "./managers";
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

    const loader = createLoader(
      `installing ${packages.length} packages using ${
        this.manager.binary
      } ${packages.map((p) => p.name + "@" + p.version)}`
    );
    loader.start();

    if (install) {
      // skip if dry run
      if (!dryRun) await this.manager.install(packages);
    } else {
      const { dev, prod } = this.manager.group(packages);
      if (dev.length)
        loader.info(
          `run ${chalk.green(snip(this.manager.getInstallCommand(dev, true)))}`
        );
      if (prod.length)
        loader.info(
          `run ${chalk.green(
            snip(this.manager.getInstallCommand(prod, false))
          )}`
        );
    }

    loader.succeed("done installing dependencies");
  }

  private get manager(): BasePackageManager {
    return new NpmManager();
  }
}

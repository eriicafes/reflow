import { exec } from "./exec";

export type Package<Dev extends boolean = boolean> = {
  name: string;
  version: string;
  dev: Dev;
};

export abstract class BasePackageManager {
  public abstract binary: string;

  public abstract commands: {
    install: string;
    save: string;
    saveDev: string;
  };

  public getInstallCommand(packages: Package[], dev: boolean) {
    return `${this.binary} ${this.commands.install} ${packages
      .map((pkg) => pkg.name + "@" + pkg.version)
      .join(" ")} ${dev ? this.commands.saveDev : this.commands.save}`;
  }

  public group(packages: Package[]) {
    // sort packages into package groups
    return packages.reduce<{ dev: Package[]; prod: Package[] }>(
      (acc, pkg) => {
        if (pkg.dev) acc.dev.push(pkg);
        else acc.prod.push(pkg);
        return acc;
      },
      { dev: [], prod: [] }
    );
  }

  public async install(packages: Package[]) {
    // sort packages into package groups
    const { dev, prod } = this.group(packages);

    if (dev.length) {
      await exec(this.getInstallCommand(dev, true));
    }

    if (prod.length) {
      await exec(this.getInstallCommand(prod, false));
    }
  }
}

export class NpmManager extends BasePackageManager {
  public readonly binary = "npm";

  public commands = {
    install: "install",
    save: "--save",
    saveDev: "--save-dev",
  };
}

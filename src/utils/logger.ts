import chalk from "chalk";

export class Logger {
  constructor(public name?: string) {}

  public for(name: string) {
    return new Logger(this.name ? this.name + ":" + name : name);
  }

  public log(...args: any[]) {
    return console.log(...(this.name ? [this.name + ":"] : []).concat(args));
  }

  public warn(...args: any[]) {
    return console.warn(
      chalk.yellow.bold((this.name || "WARN") + ":"),
      ...args
    );
  }

  public error(...args: any[]) {
    return console.error(chalk.red.bold((this.name || "ERROR") + ":"), ...args);
  }
}

export const logger = new Logger();

export const line = (...args: any) => args.join(" ") + "\n";

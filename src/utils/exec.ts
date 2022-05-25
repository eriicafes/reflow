import { promisify } from "util";
import childProcess from "child_process";

export const exec = promisify(childProcess.exec);

export const spawn = (command: string) => {
  return new Promise<void>((resolve) => {
    const [cmd, ...args] = command.split(" ") as [string, ...string[]];

    const child = childProcess.spawn(cmd, args, { stdio: "inherit" });

    child.on("close", () => resolve());
  });
};

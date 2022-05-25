import { rcFile } from "rc-config-loader";
import { line, logger } from "./logger";

export function loadConfig(rcFileName: string): Record<string, any> {
  try {
    const results = rcFile(rcFileName);
    // Not Found
    if (!results) {
      return {};
    }
    return results.config;
  } catch (err: any) {
    // Found it, but it is parsing error
    logger.for("Cannot Parse Config").warn(line() + line() + err.message);

    process.exit(1);
  }
}

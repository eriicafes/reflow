import chalk from "chalk"

export const logger = {
    log(...args: any[]) {
        return console.log(...args)
    },
    warn(...args: any[]) {
        return console.warn(chalk.yellow.bold("WARN"), ...args)
    },
    error(...args: any[]) {
        return console.error(chalk.red.bold("ERROR"), ...args)
    }
}

export const line = (...args: any) => args.join(" ") + "\n"
export const lineAfter = (...args: any) => line(...args) + "\n"
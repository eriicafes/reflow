import {promisify} from "util"
import childProcess from "child_process"

export const exec = promisify(childProcess.exec)
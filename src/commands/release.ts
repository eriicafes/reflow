import chalk from "chalk"
import { config } from "../utils/config"
import { gitDescribeTags, getCurrentBranch, pushWithTags } from "../utils/git"
import { line, lineAfter, logger } from "../utils/logger"
import { s } from "../utils/snippets"
import { bumpVersion } from "../utils/bump"
import { isCI } from "ci-info"

type ReleaseOptions = {
    dryRun: boolean
    push: boolean
    force: boolean
    as?: string
    preRelease?: boolean
    preReleaseTag?: string
}

export const release = async ({dryRun, push, force, as, preRelease, preReleaseTag}: ReleaseOptions) => {
    try {
        const branch = await getCurrentBranch()
        
        if (branch !== config.branch.main) {
            // throw error if release is called in another branch
            throw new Error(
                lineAfter("Unsupported release branch", chalk.yellow(`${branch}`) + ":") +
                line("Consider merging this branch to", `'${config.branch.main}'`, "before releasing")
            )
        }

        if (!isCI && !force) {
            // throw error if release is called in non-ci environment
            throw new Error(
                lineAfter("Unsupported environment:") +
                line("Release should be run in a CI environment. To override the default behaviour retry release with the -f option")
            )
        }

        logger.log(
            line(chalk.magentaBright("Releasing:"),
            chalk.blueBright(branch),
            dryRun ? chalk.bold.yellow("[Dry Run]") : "")
        )

        const {lastTag, commitsAfterTag} = await gitDescribeTags()

        if (commitsAfterTag === 0) throw new Error(`Duplicate release aborted, already released ${chalk.bold(lastTag)}`)

        await bumpVersion({dryRun, releaseAs: as, preRelease, preReleaseTag})

        if (push) {
            logger.log(
                line() + line(
                    chalk.magentaBright("Pushing changes with tags..."),
                    dryRun ? chalk.bold.yellow("[Dry Run]") : ""
                )
            )

            if (!dryRun) await pushWithTags()
        } else {
            logger.log(
                line("Run", chalk.green(s("git push --follow-tags")), "to push changes")
            )
        }

        process.exit()

    } catch (err: any) {
        logger.error(err.message)
        
        process.exit(1)
    }
}
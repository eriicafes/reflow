import standardVersion from "standard-version";
import { standardVersionConfig } from "./config";

export type ReleaseOptions = {
  preRelease?: never;
  preReleaseTag?: never;
};

export type PreReleaseOptions = {
  preRelease?: boolean;
  preReleaseTag?: string;
};

export type BumpOptions = {
  dryRun?: boolean;
  releaseAs?: string;
} & (ReleaseOptions | PreReleaseOptions);

export const bumpVersion = async ({
  dryRun,
  releaseAs,
  preRelease,
  preReleaseTag,
}: BumpOptions) => {
  await standardVersion({
    ...standardVersionConfig,

    // override below standard version configs

    // @ts-ignore
    // A bug in standard-version argument parsing with yargs (ie. Negating Boolean Arguments '--no-verify')
    // has caused the option 'noVerify' to be required instead of 'verify'
    // hence passing noVerify has no effect so we pass verify
    dryRun,
    releaseAs,
    verify: false,
    commitAll: true,
    prerelease: preRelease ? preReleaseTag || "" : undefined,

    // provide values for standard version configs that are only passed via cli
    tagPrefix: standardVersionConfig.tagPrefix || "v",
  });
};

# Reflow 🚀

### An opinionated workflow tool for Typescript projects 🚀

Reflow is aimed at reducing the complexity in setting up a proper dev environment for typescript projects.

## Features

- Git workflow **(Reflow CLI)**
- Format files with [Prettier](https://prettier.io)
- Lint files with [ESLint](https://eslint.org)
- Lint staged files for commit with [Lint Staged](https://github.com/okonet/lint-staged)
- Compose conventional commit messages with [Commitizen](https://github.com/commitizen/cz-cli) and [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog)
- Verify commit messages with [Commitlint](https://commitlint.js.org)
- Git Hooks with [Husky](https://github.com/typicode/husky)
- Bump versions with [Standard Version](https://github.com/conventional-changelog/standard-version)
- CI/CD with [GitHub Actions](https://github.com/features/actions)

## Installation

#### Install locally:

```bash
npm install @eriicafes/reflow
```

And initialise:

```bash
npx reflow init
```

#### Or install both globally and locally (preferred):

```bash
npm install -g @eriicafes/reflow # global

npm install @eriicafes/reflow #local
```

And initialise:

```bash
reflow init
```

With a global installation you will not be required to use `npx`. Global installation is preferred as reflow still requires a local installation and will always run the locally installed binary when available.

## Usage/Examples

Examples below assume you have both a global installation and a local installation, for local installation only you will have to prefix the command with `npx`

All commands have a `-h or --help` flag to display a help message.
Nearly all commands have a `-d or --dry-run` flag useful to see the commands that would run without actually making any changes.
Command arguments in square brackets `[]` are optional while those in angle brackets `<>` are required.

### Initialise reflow workspace

```bash
reflow init

Options:
  -n --no-install  turn off automatic package installation
  --lib            initialize as an npm library
```

### Branching

create and checkout new branch

```bash
reflow branch [name] [parent]
```

rename the current branch

```bash
reflow branch -r [name]
```

### Checkout

```bash
reflow checkout [branch]
```

checkout with search on branches (this examples searches for all branches beginning with `feat`)

```bash
reflow checkout feat
```

### Merge

merge branch to the main branch (whether on the main branch or on the branch to be merged)

```bash
reflow merge

Options:
  --prefer-ff   always perform a fast-foward merge (default: false)
```

### Commit

```bash
reflow commit

Options:
  --retry     retry last commit attempt
```

### Push

push branch to remote (prompts to sets upstream if not available) \
force push is a bit less dangerous as the following flags are attached `-f --force-with-lease --force-if-includes`

```bash
reflow push

Options:
  -f --force  force push
```

### Release

make a release (bump version, tag commit and push changes) \
would usually only be run on a CI/CD pipeline except if `-f or --force` flag is used

```bash
reflow release

Options:
  -f --force      force release when not in a CI environment (default: false)
  -a --as <type>  release with a specific version type
  --no-push       prevent pushing changes and tags to remote
```

NOTE: For projects that started with a major version at zero (0.y.z) you may need some manual action to bump the major version to 1.0.0. Once the project is ready for the first major release, run the command below from the main branch:

```bash
reflow release --as major -f
```

### Prerelease

make a pre-release (eg. v1.0.1-{tag}.0)

```bash
reflow prerelease

Options:
  -t --tag <name>  pre-release tag
  --as <type>      release with a specific version type
  --no-push        prevent pushing changes and tags to remote
```

for example if version is at 0.1.0 and we want to make a prerelease with an alpha tag and release as a a minor version:

```bash
reflow prerelease -t alpha --as minor
```

this will bump the version from 0.1.0 to 0.2.0-alpha.0

### Generate Files

type includes `configs`, `actions` and `hooks`, file is the file name, run the command without any arguments to see all possible files to generate

```bash
reflow generate [type] [file]

Options:
   -c --common   generate all common template files
   -a --all      generate all template files
```

### Actions (github actions)

When you run `reflow init` a `test.yml` workflow will be generated, which will run tests and build using `npm test` and `npm run build` respectively.
All actions are listed below:

- test.yml (run tests and build)
- version.yml (bump version and push new update with tags) requires a **VERSION_TOKEN** secret containing a Github Personal Access Token with repo permissions
- release.yml (triggered by version.yml workflow, creates a draft github release)
- publish.yml (triggered by release.yml workflow, publishes package to NPM) requires an **NPM_TOKEN** secret containing an NPM Access Token

All actions can be modified as needed

### Advanced (configure reflow CLI)

For some use cases you may need to override certain defaults in the reflow config by first generating the config file using `reflow generate` and selecting `config/reflow` (which is probably the last item on the list)

Below are the defaults which you may customize as needed:

```json
{
  "mainBranch": "main",
  "remote": "origin",
  "branchDelimeter": "/",
  "allowedBranches": [
    "feature",
    "fix",
    "chore",
    "refactor",
    "build",
    "style",
    "docs",
    "test"
  ],
  "keepMergeCommits": true
}
```

## Contributing

Pull requests are always welcome!

## Authors

- [@eriicafes](https://www.github.com/eriicafes)

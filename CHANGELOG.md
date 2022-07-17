# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0](https://github.com/eriicafes/reflow/compare/v0.2.11...v1.0.0) (2022-07-17)

### [0.2.11](https://github.com/eriicafes/reflow/compare/v0.2.10...v0.2.11) (2022-07-17)


### Bug Fixes

* change project description in package.json ([3ed7dae](https://github.com/eriicafes/reflow/commit/3ed7dae7c26b4b59f65a7dbc0cd21b0a4d1fb244))

### [0.2.10](https://github.com/eriicafes/reflow/compare/v0.2.9...v0.2.10) (2022-07-17)

### 0.2.9 (2022-07-17)

### 0.2.8 (2022-07-16)

### 0.2.7 (2022-07-16)

### 0.2.6 (2022-07-16)

### 0.2.5 (2022-07-16)

### 0.2.4 (2022-05-28)

### 0.2.3 (2022-05-26)

### 0.2.2 (2022-05-26)


### Bug Fixes

* use github PAT for version action to enable triggering of other actions ([81df73e](https://github.com/eriicafes/reflow/commit/81df73ed0800d3a7e12376b8ab7604db815bfb29))

### 0.2.1 (2022-05-25)


### Features

* add dispatch for publish workflow ([91f8e10](https://github.com/eriicafes/reflow/commit/91f8e1056dcdeeb1a912a07700db09cac3274806))

## [0.2.0](https://github.com/eriicafes/reflow/compare/v0.1.10...v0.2.0) (2022-05-25)

### 0.1.10 (2022-05-25)


### Bug Fixes

* remove lint step from test workflow and add git git credentials to version workflow ([912d50c](https://github.com/eriicafes/reflow/commit/912d50c6ee62873d8727bb234cc53b80f129af6b))

### [0.1.9](https://github.com/eriicafes/reflow/compare/v0.1.8...v0.1.9) (2022-04-04)

### Features

- add -v version alias ([6b411ac](https://github.com/eriicafes/reflow/commit/6b411acfb815d606bfbcc12791e7900f32d8864a))

### [0.1.8](https://github.com/eriicafes/reflow/compare/v0.1.7...v0.1.8) (2022-02-22)

### Features

- added branch program and refactored some branch functions ([a0ff7af](https://github.com/eriicafes/reflow/commit/a0ff7affd0393db8b6c91117b227a35a655b0df5))
- added branch program and refactored some branch functions ([9b4f765](https://github.com/eriicafes/reflow/commit/9b4f76531dfd50ee6103bbb7371b78b21ebe9c33))
- added checkout program ([176eb7e](https://github.com/eriicafes/reflow/commit/176eb7e906a7e52e3e20e0fb25d6cd7d9e478cb3))
- added proper descriptions to programs ([d884ef2](https://github.com/eriicafes/reflow/commit/d884ef2af4731fabeef2c69664d1c4a5e789f580))

### Bug Fixes

- fix branch program 'rename' option message and refactored git delete branch ([a8310f5](https://github.com/eriicafes/reflow/commit/a8310f5b2cd8a395560c6c1288013cfc7bddc7ca))

### [0.1.7](https://github.com/eriicafes/reflow/compare/v0.1.6...v0.1.7) (2022-02-21)

### Features

- stop duplicate releases by checking number of commits after the latest tag ([3119bff](https://github.com/eriicafes/reflow/commit/3119bffb8aa4314569328eb09939b36abf1287bd))

### [0.1.6](https://github.com/eriicafes/reflow/compare/v0.1.5...v0.1.6) (2022-02-21)

### Bug Fixes

- exit merge prompt immediately when user decides not to merge ([2cb90e9](https://github.com/eriicafes/reflow/commit/2cb90e9311443c3005242dea05099b2d4687c59e))

### [0.1.5](https://github.com/eriicafes/reflow/compare/v0.1.4...v0.1.5) (2022-02-21)

### Features

- handled case of a merge conflict where the post-merge hook is not called ([95dc335](https://github.com/eriicafes/reflow/commit/95dc335ccfd14cd518aefef061edc214bb41dec3))

### [0.1.4](https://github.com/eriicafes/reflow/compare/v0.1.3...v0.1.4) (2022-02-20)

### Bug Fixes

- exit early when no working branches are available to merge from ([1069da1](https://github.com/eriicafes/reflow/commit/1069da1839cca58e1a7ce0945b32652eb8a16889))

### [0.1.3](https://github.com/eriicafes/reflow/compare/v0.1.2...v0.1.3) (2022-02-20)

### Bug Fixes

- handle errors in command with try-catch block ([13c71ad](https://github.com/eriicafes/reflow/commit/13c71ad24f455735aa1a763509fbd4ea56adc965))
- remove space after --no-ff which causes the git merge command to fail ([667240e](https://github.com/eriicafes/reflow/commit/667240ea21434d0f3d3dc0138df20747c8e71695))

### [0.1.2](https://github.com/eriicafes/reflow/compare/v0.1.1...v0.1.2) (2022-02-20)

### Features

- added merge program ([f1322b8](https://github.com/eriicafes/reflow/commit/f1322b853a08c49cabe692c3c8224d02e317d5df))
- added spawn child_process with stdio set to 'inherit' form merge command to be interactive ([3cce193](https://github.com/eriicafes/reflow/commit/3cce1933ffd2f27ebf7cbed68f87bb03e1f42074))

### Bug Fixes

- throw appropriate error in pushWithTags ([5cc779f](https://github.com/eriicafes/reflow/commit/5cc779fa2d92dfeb35e4c7374f37ba2e80d36e84))

### 0.1.1 (2022-02-20)

### Features

- added commit program ([5d8730a](https://github.com/eriicafes/reflow/commit/5d8730af54848c07f1a0cd9f72c64e0224b89393))
- added release command ([2c1cb8c](https://github.com/eriicafes/reflow/commit/2c1cb8c695d89c9d61a96ff44350b80b70398c2a))
- added release program ([4bdb990](https://github.com/eriicafes/reflow/commit/4bdb9907bba56ea8f82e232afc9ecf59e4c5ede3))
- added standard-version and git push commands to release program ([d1dc018](https://github.com/eriicafes/reflow/commit/d1dc0188d8a14859f224f81996c9ee0821078597))

### Bug Fixes

- add commit all to standard-version to avoid git partial commit error ([82b02ea](https://github.com/eriicafes/reflow/commit/82b02ea3563334b85ff9abb3fb90198855d8de0c))
- **husky:** change file permisssion on pre-merge-commit hook ([b706480](https://github.com/eriicafes/reflow/commit/b706480a94a94cf928b208e792dad33691d6586a))

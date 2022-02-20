# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.4](https://github.com/eriicafes/reflow/compare/v0.1.3...v0.1.4) (2022-02-20)


### Bug Fixes

* exit early when no working branches are available to merge from ([1069da1](https://github.com/eriicafes/reflow/commit/1069da1839cca58e1a7ce0945b32652eb8a16889))

### [0.1.3](https://github.com/eriicafes/reflow/compare/v0.1.2...v0.1.3) (2022-02-20)


### Bug Fixes

* handle errors in command with try-catch block ([13c71ad](https://github.com/eriicafes/reflow/commit/13c71ad24f455735aa1a763509fbd4ea56adc965))
* remove space after --no-ff which causes the git merge command to fail ([667240e](https://github.com/eriicafes/reflow/commit/667240ea21434d0f3d3dc0138df20747c8e71695))

### [0.1.2](https://github.com/eriicafes/reflow/compare/v0.1.1...v0.1.2) (2022-02-20)


### Features

* added merge program ([f1322b8](https://github.com/eriicafes/reflow/commit/f1322b853a08c49cabe692c3c8224d02e317d5df))
* added spawn child_process with stdio set to 'inherit' form merge command to be interactive ([3cce193](https://github.com/eriicafes/reflow/commit/3cce1933ffd2f27ebf7cbed68f87bb03e1f42074))


### Bug Fixes

* throw appropriate error in pushWithTags ([5cc779f](https://github.com/eriicafes/reflow/commit/5cc779fa2d92dfeb35e4c7374f37ba2e80d36e84))

### 0.1.1 (2022-02-20)


### Features

* added commit program ([5d8730a](https://github.com/eriicafes/reflow/commit/5d8730af54848c07f1a0cd9f72c64e0224b89393))
* added release command ([2c1cb8c](https://github.com/eriicafes/reflow/commit/2c1cb8c695d89c9d61a96ff44350b80b70398c2a))
* added release program ([4bdb990](https://github.com/eriicafes/reflow/commit/4bdb9907bba56ea8f82e232afc9ecf59e4c5ede3))
* added standard-version and git push commands to release program ([d1dc018](https://github.com/eriicafes/reflow/commit/d1dc0188d8a14859f224f81996c9ee0821078597))


### Bug Fixes

* add commit all to standard-version to avoid git partial commit error ([82b02ea](https://github.com/eriicafes/reflow/commit/82b02ea3563334b85ff9abb3fb90198855d8de0c))
* **husky:** change file permisssion on pre-merge-commit hook ([b706480](https://github.com/eriicafes/reflow/commit/b706480a94a94cf928b208e792dad33691d6586a))

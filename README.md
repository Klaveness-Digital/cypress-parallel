# cypress-parallel

Divides your test files into equal buckets and runs a single bucket. This is ideal for parallizing
Cypress tests in a CI environment, without relying on Cypress' paid Dashboard Service.

## Table of Contents

- [Installation](#installation)
- [How it works](#how-it-works)
- [Usage](#usage)
  - [--node \<index>:\<total>](#--node-indextotal)
  - [--knapsack \<file>](#--knapsack-file)
  - [--disable-knapsack-output](#--disable-knapsack-output)
  - [--unweighed-strategy "estimate" | "distribute"](#--unweighed-strategy-estimate--distribute)
- [CI configuration](#ci-configuration)
  - [Gitlab CI](#gitlab-ci)
  - [Other providers](#other-providers)

## Installation

```
$ npm install @badeball/cypress-parallel
```

## How it works

1. It will search through your project for test files
2. A knapsack containing file weights is read (defaults to `knapsack.json`)
3. Tests are divided into N buckets
4. The Ith bucket is executed by passing `--spec` to Cypress with said bucket of files
5. The knapsack is overwritten with potentially new weights

N and I is determined either by a flag `--node` or by environment variables for some CI providers.

The overwritten knapsack can then be comitted back into VCS. This will allow the library to always
divide your tests somewhat evenly among the nodes.

## Usage

Below are all the configuration options and some extended explanation for some of them.

```
$ npx cypress-parallel --help
Usage: cypress-parallel [options]

Options:
  -v, --version                    output the version number
  --cypress-run-command <cmd>      specifies the command to run cypress (in non-interactive mode), defaults
                                   to 'npx cypress run' or 'yarn cypress run' depending on how invoked
  --node <index>:<count>           specifies number of buckets and which to run
  --knapsack <path>                specifies the path to the knapsack file (default: "knapsack.json")
  --disable-knapsack-output        disabled knapsack output (default: false)
  --unweighed-strategy <strategy>  strategy to utilize for unweighed test files ('estimate' (default) |
                                   'distribute') (default: "estimate")
  -h, --help                       display help for command
```

Unrecognized arguments are passed along to Cypress, so arguments such as `-e / --env` can be used
as shown below

```
$ npx cypress-parallel --env foo=bar
```

### --node \<index>:\<total>

The utility will automatically pick up node configuration for some CI providers. Otherwise you can
specify node index and total node count using `--node`, as shown below.

```
$ npx cypress-parallel --node 1:5
```

### --knapsack \<file>

Specifies the location of the knapsack file. Defaults to `knapsack.json`.

### --disable-knapsack-output

Disables outputting knapsack data to the file system. This is always disabled when you specify
`--reporter` or `--reporter-options` to Cypress. If you require custom options and still want to
obtain the knapsack output, you need to configure `cypress-multi-reporters` with
`@badeball/mocha-knapsack-reporter` yourself.

### --unweighed-strategy "estimate" | "distribute"

What strategy to utilize if encountering a test file that isn't contained in the knapsack. The
"estimate" strategy will estimate expected execution time based off of file length (line numbers).
The "distribute" strategy will merely distribute unknown files evenly amongst the nodes.

Custom stragies can be implemented using [cusmiconfig][cusmiconfig], as shown below.

```js
module.export = {
  /** @type {import("@badeball/cypress-parallel").UnweighedStrategy} */
  unweighedStrategy(weighedFiles, unweighedFiles, nodeCount) {
    // Implement me.
  },
};
```

[cusmiconfig]: https://github.com/davidtheclark/cosmiconfig

## CI configuration

Below is an example of how to configure Gitlab CI to parallelize Cypress tests. Contributions of
similar examples for other providers are welcome.

### Gitlab CI

This example illustrate two things, 1) running tests in parallel and 2) combining knapsack data into
a single, downloadable artifact. The latter is completely optional and you need to decide for
yourself how you want to handle this.

```yaml
test:
  stage: Test (1)
  parallel: 5
  artifacts:
    when: always
    paths:
      - knapsack-$CI_NODE_INDEX.json
    expire_in: 1 day
  script:
    - npx cypress-parallel --knapsack "knapsack-$CI_NODE_INDEX.json

knapsack:
  stage: Test (2)
  script:
    - cat knapsack-*.json | jq -sS add | tee knapsack.json
  artifacts:
    when: always
    paths:
      - knapsack.json
    expire_in: 1 day
```

### Other providers

If your provider does to provide a keyword such as Gitlab's `parallel`, then you can always simply
just create N explicit jobs, similar to that shown below.

```yaml
test_1:
  stage: Test
  script:
    - npx cypress-parallel --node 1:5

test_2:
  stage: Test
  script:
    - npx cypress-parallel --node 2:5

test_3:
  stage: Test
  script:
    - npx cypress-parallel --node 3:5

test_4:
  stage: Test
  script:
    - npx cypress-parallel --node 4:5

test_5:
  stage: Test
  script:
    - npx cypress-parallel --node 5:5
```

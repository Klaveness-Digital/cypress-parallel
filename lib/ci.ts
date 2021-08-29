import {
  NodeConfiguration,
  parseAndValidateNodeConfiguration,
} from "./configuration";

import debug from "./debug";

function tryResolveNodeConfigurationFromProvider(
  env: NodeJS.ProcessEnv,
  provider: string,
  indexKey: string,
  countKey: string
) {
  const index = env[indexKey],
    count = env[countKey];

  if (typeof index === "string" && typeof count === "string") {
    debug(`found ${indexKey} and ${countKey} (${provider})`);

    return parseAndValidateNodeConfiguration(index, count);
  }
}

export function tryResolveNodeConfiguration(
  env: NodeJS.ProcessEnv
): NodeConfiguration | undefined {
  return (
    // https://docs.gitlab.com/ee/ci/yaml/#parallel
    // https://devcenter.heroku.com/articles/heroku-ci-parallel-test-runs#parallelizing-your-test-suite
    tryResolveNodeConfigurationFromProvider(
      env,
      "Gitlab, Heroku",
      "CI_NODE_INDEX",
      "CI_NODE_TOTAL"
    ) ||
    // https://circleci.com/docs/2.0/parallelism-faster-jobs/#using-environment-variables-to-split-tests
    tryResolveNodeConfigurationFromProvider(
      env,
      "CircleCI",
      "CIRCLE_NODE_INDEX",
      "CIRCLE_NODE_TOTAL"
    )
  );
}

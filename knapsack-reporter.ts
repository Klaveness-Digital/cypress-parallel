import fs from "fs";

import Mocha from "mocha";

import { createError } from "./lib/assertions";

const { EVENT_RUN_END, EVENT_SUITE_BEGIN } = Mocha.Runner.constants;

export = class KnapsackReporter {
  constructor(runner: any, options: any) {
    const stats = runner.stats;
    const { reporterOptions } = options;
    const { output } = reporterOptions ? reporterOptions : { output: null };

    if (!output) {
      throw createError(
        "'output' must be configured for KnapsackReporter to work"
      );
    }

    let spec: any;

    runner
      .on(EVENT_SUITE_BEGIN, (suite: any) => {
        if (suite.root) {
          spec = suite.file;
        }
      })
      .once(EVENT_RUN_END, () => {
        if (!spec) {
          throw createError("'spec' hasn't been determined");
        }

        const { duration } = stats;

        const content = fs.existsSync(output)
          ? JSON.parse(fs.readFileSync(output).toString())
          : {};

        fs.writeFileSync(
          output,
          JSON.stringify(
            {
              ...content,
              [spec]: duration,
            },
            null,
            2
          )
        );
      });
  }
};

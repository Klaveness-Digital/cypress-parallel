import util from "util";

import { CypressParallelError } from "./error";

import { UnweighedStrategy } from "./unweighed-strategy";

export interface NodeConfiguration {
  index: number;
  count: number;
}

export interface IParallelConfiguration {
  readonly cypressRunCommand: string;
  readonly node: {
    index: number;
    count: number;
  };
  readonly knapsack: string;
  readonly disableKnapsackOutput: boolean;
  readonly unweighedStrategy: "estimate" | "distribute" | UnweighedStrategy;
}

const NUMBER_EXPR = /^\d+$/;

export class NodeConfigurationParseError extends CypressParallelError {}

export function parseAndValidateNodeConfiguration(
  unparsedIndex: string,
  unparsedCount: string
) {
  if (!NUMBER_EXPR.test(unparsedIndex)) {
    throw new NodeConfigurationParseError(
      `Expected a number for node index, but got ${util.inspect(unparsedIndex)}`
    );
  }

  if (!NUMBER_EXPR.test(unparsedCount)) {
    throw new NodeConfigurationParseError(
      `Expected a number for node count, but got ${util.inspect(unparsedCount)}`
    );
  }

  const index = parseInt(unparsedIndex, 10);
  const count = parseInt(unparsedCount, 10);

  if (!(index > 0)) {
    throw new NodeConfigurationParseError("Expected node index > 0");
  }

  if (!(count > 0)) {
    throw new NodeConfigurationParseError("Expected node count > 0");
  }

  if (!(count >= index)) {
    throw new NodeConfigurationParseError("Expected node count >= node index");
  }

  return {
    index,
    count,
  };
}

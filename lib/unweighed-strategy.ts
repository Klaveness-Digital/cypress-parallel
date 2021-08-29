import util from "util";

import { cosmiconfig } from "cosmiconfig";

import { CypressParallelError } from "./error";

export interface WeighedFile {
  file: string;
  content: string;
  weight: number;
}

export interface UnweighedFile {
  file: string;
  content: string;
}

export interface UnweighedStrategy {
  (
    weighedFiles: WeighedFile[],
    unweighedFiles: UnweighedFile[],
    nodeCount: number
  ): NodeSchedule[];
}

export type NodeSchedule = (WeighedFile | UnweighedFile)[];

export class ConfigurationError extends CypressParallelError {}

export async function resolveCustomStrategy(searchFrom?: string) {
  const result = await cosmiconfig("cypress-parallel").search(searchFrom);

  if (result) {
    const { config: rawConfig } = result;

    if (typeof rawConfig !== "object" || rawConfig == null) {
      throw new CypressParallelError(
        `Malformed configuration, expected an object, but got ${util.inspect(
          rawConfig
        )}`
      );
    }

    const { unweighedStrategy } = rawConfig;

    if (unweighedStrategy) {
      if (typeof unweighedStrategy === "function") {
        return unweighedStrategy as UnweighedStrategy;
      } else {
        throw new ConfigurationError(
          `Expected a function (unweighedStrategy), but got ${util.inspect(
            unweighedStrategy
          )}`
        );
      }
    }
  }
}

import { NodeConfiguration } from "./configuration";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isNodeConfiguration(value: any): value is NodeConfiguration {
  return typeof value?.index === "number" && typeof value?.count === "number";
}

export function isKnapsack(value: unknown): value is Record<string, number> {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.values(value as object).every(isNumber)
  );
}

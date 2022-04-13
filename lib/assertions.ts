import { name, homepage } from "../package.json";

export function createError(message: string) {
  return new Error(
    `${name}: ${message} (this might be a bug, please report at ${homepage})`
  );
}

export function fail(message: string) {
  throw createError(message);
}

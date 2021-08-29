import { WeighedFile } from "../unweighed-strategy";

export function weightOfSchedule(schedule: WeighedFile[]) {
  return schedule.reduce((weight, testFile) => weight + testFile.weight, 0);
}

export function compare(a: number, b: number): 1 | 0 | -1;
export function compare(a: string, b: string): 1 | 0 | -1;
export function compare(a: number | string, b: number | string) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
}

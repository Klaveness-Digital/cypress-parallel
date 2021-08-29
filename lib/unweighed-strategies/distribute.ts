import {
  WeighedFile,
  UnweighedFile,
  NodeSchedule,
} from "../unweighed-strategy";

import { compare, weightOfSchedule } from "./utils";

export function distribute(
  weighedFiles: WeighedFile[],
  unweighedFiles: UnweighedFile[],
  nodeCount: number
) {
  const intermediateSchedule: WeighedFile[][] = Array.from(
    { length: nodeCount },
    () => {
      return [];
    }
  );

  weighedFiles.sort((a, b) => {
    if (a.weight === b.weight) {
      return compare(a.file, b.file);
    } else {
      return compare(b.weight, a.weight);
    }
  });

  for (const weighedFile of weighedFiles) {
    const leastAssignedNode = intermediateSchedule.sort(
      (a, b) => weightOfSchedule(a) - weightOfSchedule(b)
    )[0];

    leastAssignedNode.push(weighedFile);
  }

  const determinedSchedule: NodeSchedule[] = intermediateSchedule.sort(
    (a, b) => weightOfSchedule(a) - weightOfSchedule(b)
  );

  for (let i = 0; i < unweighedFiles.length; i++) {
    determinedSchedule[i % nodeCount].push(unweighedFiles[i]);
  }

  return determinedSchedule;
}

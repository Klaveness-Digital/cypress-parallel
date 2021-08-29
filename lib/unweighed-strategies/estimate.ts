import { WeighedFile, UnweighedFile } from "../unweighed-strategy";

import { distribute } from "./distribute";

import { compare, weightOfSchedule } from "./utils";

function zip<A, B>(collection: [A, B][]): [A[], B[]] {
  if (collection.length === 0) {
    return [[], []];
  }

  const [[firstA, firstB], ...rest] = collection;

  return rest.reduce<[A[], B[]]>(
    ([colA, colB], [a, b]) => {
      return [
        [...colA, a],
        [...colB, b],
      ];
    },
    [[firstA], [firstB]]
  );
}

function sum(collection: number[]) {
  return collection.reduce((sum, n) => sum + n, 0);
}

export function estimate(
  weighedFiles: WeighedFile[],
  unweighedFiles: UnweighedFile[],
  nodeCount: number
) {
  if (weighedFiles.length === 0) {
    return distribute(weighedFiles, unweighedFiles, nodeCount);
  }

  const averageTimePerLine = zip(
    weighedFiles.map((testFile) => [
      testFile.weight,
      testFile.content.split("\n").length,
    ])
  )
    .map((collection) => sum(collection))
    .reduce((totalTime, totalLines) => totalTime / totalLines);

  const estimatedFiles = unweighedFiles.map((unweighedFile) => {
    const estimatedWeight =
      unweighedFile.content.split("\n").length * averageTimePerLine;

    return {
      ...unweighedFile,
      weight: estimatedWeight,
    };
  });

  const allFiles = [...weighedFiles, ...estimatedFiles].sort((a, b) => {
    if (a.weight === b.weight) {
      return compare(a.file, b.file);
    } else {
      return compare(b.weight, a.weight);
    }
  });

  const schedule: WeighedFile[][] = Array.from({ length: nodeCount }, () => {
    return [];
  });

  for (const file of allFiles) {
    const leastAssignedNode = schedule.sort(
      (a, b) => weightOfSchedule(a) - weightOfSchedule(b)
    )[0];

    leastAssignedNode.push(file);
  }

  return schedule;
}

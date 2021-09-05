const { After, Before } = require("@cucumber/cucumber");
const path = require("path");
const { promises: fs } = require("fs");
const { writeFile } = require("./helpers");

const projectPath = path.join(__dirname, "..", "..");
const { formatterHelpers } = require("@cucumber/cucumber");

Before(async function ({ gherkinDocument, pickle }) {
  const relativeUri = path.relative(process.cwd(), gherkinDocument.uri);

  const { line } = formatterHelpers.PickleParser.getPickleLocation({
    gherkinDocument,
    pickle,
  });

  this.tmpDir = path.join(projectPath, "tmp", `${relativeUri}_${line}`);

  await fs.rm(this.tmpDir, { recursive: true, force: true });

  await writeFile(
    path.join(this.tmpDir, "cypress.json"),
    JSON.stringify(
      {
        video: false,
      },
      null,
      2
    )
  );

  await fs.mkdir(path.join(this.tmpDir, "node_modules"), {
    recursive: true,
  });

  await fs.symlink(
    path.join(projectPath, "node_modules", "cypress-multi-reporters"),
    path.join(this.tmpDir, "node_modules", "cypress-multi-reporters")
  );
});

After(function () {
  if (
    this.lastRun != null &&
    this.lastRun.exitCode !== 0 &&
    !this.verifiedLastRunError
  ) {
    throw new Error(
      `Last run errored unexpectedly. Output:\n\n${this.lastRun.output}`
    );
  }
});

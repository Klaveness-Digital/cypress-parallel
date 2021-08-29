const { Given, Then } = require("@cucumber/cucumber");
const stripIndent = require("strip-indent");
const path = require("path");
const assert = require("assert");
const { promises: fs, constants } = require("fs");
const { writeFile } = require("../support/helpers");

Given("a file named {string} with:", async function (filePath, fileContent) {
  const absoluteFilePath = path.join(this.tmpDir, filePath);

  await writeFile(absoluteFilePath, stripIndent(fileContent));
});

Given("an empty file named {string}", async function (filePath) {
  const absoluteFilePath = path.join(this.tmpDir, filePath);

  await writeFile(absoluteFilePath, "");
});

Then(
  "I should nonetheless see a file named {string}",
  async function (filePath) {
    const absoluteFilePath = path.join(this.tmpDir, filePath);

    try {
      await fs.access(absoluteFilePath, constants.F_OK);
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(`Expected ${filePath} to exist, but it doesn't`);
      } else {
        throw e;
      }
    }
  }
);

Then("I should not see a file named {string}", async function (filePath) {
  const absoluteFilePath = path.join(this.tmpDir, filePath);

  try {
    await fs.access(absoluteFilePath, constants.F_OK);
    throw new Error(`Expected ${filePath} to not exist, but it did`);
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }
});

Then(
  "I should see a file {string} with content:",
  async function (filePath, expectedContent) {
    const absoluteFilePath = path.join(this.tmpDir, filePath);

    try {
      const actualContent = (await fs.readFile(absoluteFilePath)).toString();

      assert.strictEqual(actualContent, expectedContent);
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(`Expected ${filePath} to exist, but it doesn't`);
      } else {
        throw e;
      }
    }
  }
);

Then(
  "I should see a file {string} with content matching:",
  async function (filePath, expectedContentExpr) {
    const absoluteFilePath = path.join(this.tmpDir, filePath);

    try {
      const actualContent = (await fs.readFile(absoluteFilePath)).toString();

      assert.match(actualContent, new RegExp(expectedContentExpr));
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new Error(`Expected ${filePath} to exist, but it doesn't`);
      } else {
        throw e;
      }
    }
  }
);

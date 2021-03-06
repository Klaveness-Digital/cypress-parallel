import { Given, Then } from "@cucumber/cucumber";
import stripIndent from "strip-indent";
import path from "path";
import assert from "assert";
import { promises as fs, constants } from "fs";
import { writeFile } from "../support/helpers";

Given("a file named {string} with:", async function (filePath, fileContent) {
  const absoluteFilePath = path.join(this.tmpDir, filePath);

  await writeFile(absoluteFilePath, stripIndent(fileContent));
});

Given("an empty file named {string}", async function (filePath) {
  const absoluteFilePath = path.join(this.tmpDir, filePath);

  await writeFile(absoluteFilePath, "");
});

Given(
  "an empty, but unreadable file named {string}",
  async function (filePath) {
    const absoluteFilePath = path.join(this.tmpDir, filePath);

    await writeFile(absoluteFilePath, "");

    /**
     * I'm guessing it's created with 0755, so 355 is the u-r equivalent.
     */
    await fs.chmod(absoluteFilePath, 0o355);
  }
);

Then(
  "I should nonetheless see a file named {string}",
  async function (filePath) {
    const absoluteFilePath = path.join(this.tmpDir, filePath);

    try {
      await fs.access(absoluteFilePath, constants.F_OK);
    } catch (e: any) {
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
  } catch (e: any) {
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
    } catch (e: any) {
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
    } catch (e: any) {
      if (e.code === "ENOENT") {
        throw new Error(`Expected ${filePath} to exist, but it doesn't`);
      } else {
        throw e;
      }
    }
  }
);

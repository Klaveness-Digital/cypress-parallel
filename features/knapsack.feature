Feature: knapsack.json
  Rule: it should handle "any" knapsack
    Scenario: knapsack missing a file
      Given a file named "cypress/integration/a.js" with:
        """
        it("should pass", () => {});
        """
      And a file named "knapsack.json" with:
        """
        {}
        """
      Given I run cypress-parallel with "--node 1:1"
      Then it passes

    Scenario: knapsack containing a removed file
      Given a file named "cypress/integration/a.js" with:
        """
        it("should pass", () => {});
        """
      And a file named "knapsack.json" with:
        """
        {
          "cypress/integration/a.js": 1,
          "cypress/integration/b.js": 1
        }
        """
      Given I run cypress-parallel with "--node 1:1"
      Then it passes

    Scenario: knapsack containing "ignored" files (due to EG. narrow testFiles)
      Given additional Cypress configuration
        """
        {
          "testFiles": "**/a.js"
        }
        """
      And a file named "cypress/integration/a.js" with:
        """
        it("should pass", () => {});
        """
      And a file named "cypress/integration/b.js" with:
        """
        it("should pass", () => {});
        """
      And a file named "knapsack.json" with:
        """
        {
          "cypress/integration/a.js": 1,
          "cypress/integration/b.js": 1
        }
        """
      Given I run cypress-parallel with "--node 1:1"
      Then it passes
      And it should appear as if only a single test ran

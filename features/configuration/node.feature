Feature: --node
  Rule: it should determine bucket of tests
    Background:
      Given a file named "cypress/integration/a.js" with:
        """
        it("should pass", () => expect(true).to.be.true);
        """
      And a file named "cypress/integration/b.js" with:
        """
        it("should pass", () => expect(true).to.be.true);
        """
      And a file named "cypress/integration/c.js" with:
        """
        it("should pass", () => expect(true).to.be.true);
        """
      And a file named "cypress/integration/d.js" with:
        """
        it("should pass", () => expect(true).to.be.true);
        """
      And a file named "cypress/integration/e.js" with:
        """
        it("should pass", () => expect(true).to.be.true);
        """

    Scenario Outline: --node <index>:5
      Given I run cypress-parallel with "--node <index>:5"
      Then it passes
      And it should appear as if only a single test named "<test>" ran

      Examples:
        | index | test |
        | 1     | a.js |
        | 2     | b.js |
        | 3     | c.js |
        | 4     | d.js |
        | 5     | e.js |

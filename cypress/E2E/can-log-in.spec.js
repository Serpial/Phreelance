import sampleUsers from "../fixtures/sample-users.json";

beforeEach(() => {
  console.log("Clean-up...");
  cy.clearCookies();
  cy.clearLocalStorage();
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
});

/**
 * Does successfully load login page
 */
it("Can load login page", () => {
  cy.visit("http://localhost:3000/login");
  cy.get(".card-title").contains("Login");
});

/**
 * Test that an account can be logged into
 */
it("Can log in and log out", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.bidder.email);
  cy.get("input[name=password]").type(sampleUsers.bidder.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");
});

/**
 * Log in then log out the user.
 */
it("Can log out logged  in user", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.bidder.email);
  cy.get("input[name=password]").type(sampleUsers.bidder.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");

  // Logout user
  cy.get(".nav-item_content").contains("Sign out").click({ force: true });
  cy.url().should("include", "/login");
});

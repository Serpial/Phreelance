import sampleUsers from "../fixtures/sample-users.json";

beforeEach(() => {
  console.log("Clean-up...");
  cy.clearCookies();
  cy.clearLocalStorage();
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
});

/**
 * Test to make sure the basic action of navigating to the create listing page
 * is possible
 */
it("Vendor can navigate to New Listing Page", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.vendor.email);
  cy.get("input[name=password]").type(sampleUsers.vendor.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");

  // Navigate to create new listing
  cy.get(".nav-item_content").contains("New Listing").click();
  cy.get(".card-title").contains("About").should("have.text", "About");
});

/**
 * Test to make sure the basic action of navigating to the create listing page
 * is possible
 */
it("Can create new draft listing and delete", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.vendor.email);
  cy.get("input[name=password]").type(sampleUsers.vendor.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");

  // Navigate to create new listing
  cy.get(".nav-item_content").contains("New Listing").click();

  // Add listing details
  cy.get("input[name=title]").type("My new contact");
  cy.get("textarea[name=description]").type(
    "This is my new contract. Please bid on it"
  );
  cy.get("input[name=reserve-price]").type(1000);

  // Submit draft
  cy.get(".btn").contains("Save as draft").click();

  // Verify created
  cy.get(".auction_title").should("have.text", "My new contact");
  cy.wait(5000);

  // Remove draft
  cy.get(".btn").contains("Remove draft").click();
  cy.get(".btn").contains("Remove").click();

  // verify we have returned to my-auctions
  cy.url().should("include", "my-auctions");
});

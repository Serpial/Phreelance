import sampleUsers from "../fixtures/sample-users.json";

beforeEach(() => {
  console.log("Clean-up...");
  cy.clearCookies();
  cy.clearLocalStorage();
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
});

/**
 * User can log in and navigate to test auction.
 */
it("Can navigate to test auction", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.bidder.email);
  cy.get("input[name=password]").type(sampleUsers.bidder.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");

  // Search for test auction
  const testAuctionName = "Long test auction";
  cy.get(".filter-card_options-key-word-search").type(testAuctionName);
  cy.get(".btn").contains("Update").click();
  cy.wait(100);

  // Open test auction
  cy.get(".auction-card_title").contains(testAuctionName).click();
  cy.get(".auction_title").should("have.text", testAuctionName);
});

/**
 * Test that a bid can be placed
 */
it("Place bid", () => {
  cy.visit("http://localhost:3000/login");

  // Input user details
  cy.get("input[name=email]").type(sampleUsers.bidder.email);
  cy.get("input[name=password]").type(sampleUsers.bidder.password);
  cy.get(".login_submit-button").click();
  cy.url().should("include", "/find-auctions");

  // Search for test auction
  const testAuctionName = "Long test auction";
  cy.get(".filter-card_options-key-word-search").type(testAuctionName);
  cy.get(".btn").contains("Update").click();
  cy.wait(100);

  // Open test auction
  cy.get(".auction-card_title").contains(testAuctionName).click();
  cy.wait(3000);

  // Open "create bid" modal
  cy.get(".auction_button").contains("Create bid").click();
  cy.get(".bidding-modal_reserve-price_value").should(
    "have.text",
    " £5,000.00"
  );

  // Post same bid as reserve
  cy.get("input[name=bid]").type("5001");
  cy.get("input[name=completion-time]").type("4");
  cy.get("textarea[name=proposal]").type("I won't be completing this contract");
  cy.get(".btn").contains("Publish").click();
  cy.get(".bidding-modal_alerts").should(
    "have.text",
    "Your bid is greater than the reserve price."
  );
});

describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173/sign-in");
  });
  it("does not pass passes", () => {
    cy.visit("http://localhost:5173/mailbox");
  });
  it("does not sign-up", () => {
    cy.visit("http://localhost:5173/sign-up");

    cy.get(".Cypress-email").type("100@google.com");
    cy.get(".Cypress-pass").type("testPassword1221@");
    cy.get(".Cypress-select").click();
    cy.contains(".ant-select-item-option", "1 day").click();
    cy.get('button[type="submit"]').click();
    cy.contains("Sorry");
  });
  it("sign-up and go to mailbox", () => {
    cy.visit("http://localhost:5173/sign-up");

    cy.get(".Cypress-email").type("Cypress@ahmads.dev");
    cy.get(".Cypress-pass").type("testPassword1221@");
    cy.get(".Cypress-select").click();
    cy.contains(".ant-select-item-option", "1 day").click();
    cy.get('button[type="submit"]').click();
    cy.contains("The account");
  });
  it("does not sign in ", () => {
    cy.visit("http://localhost:5173/sign-in");
    cy.get(".Cypress-email").type("101@ahmads.dev");
    cy.get(".Cypress-pass").type("testPassword1221@");
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid");
  });
  it("sign in ", () => {
    cy.visit("http://localhost:5173/sign-in");
    cy.get(".Cypress-email").type("gmp@ahmads.dev");
    cy.get(".Cypress-pass").type("Aa122133@");
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.url().should("include", "/mailbox", { timeout: 10000 });
  });
});

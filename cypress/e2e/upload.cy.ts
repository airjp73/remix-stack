before(() => {
  cy.login();
});

it("should upload a file", () => {
  cy.visitAndCheck("/dashboard");
  cy.findByRole("link", { name: /upload profile picture/i }).click();
  cy.fixture("images/cat-picture.jpg", null).then((pic) => {
    cy.findByLabelText(/upload a file/i)
      .parent() // get the upload area not the actual input
      .selectFile(pic, { action: "drag-drop" });
  });
  cy.findByRole("alert")
    .findByRole("heading", { name: /profile picture uploaded!/i })
    .should("exist");
  cy.findByRole("link", { name: /back to dashboard/i }).click();
  cy.location("pathname").should("contain", "/dashboard");
});

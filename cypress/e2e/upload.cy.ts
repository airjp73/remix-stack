beforeEach(() => {
  cy.session("session", () => {
    cy.login();
  });
});

it("should upload a file", () => {
  cy.visitAndCheck("/dashboard");
  cy.findByRole("link", { name: /upload profile picture/i }).click();
  cy.fixture("images/cat-picture.jpg", null).then((pic) => {
    cy.findByLabelText(/upload a file/i)
      .parent() // get the upload area not the actual input
      .selectFile(pic, { action: "drag-drop" });
  });
  cy.findByText(/profile picture uploaded!/i).should("exist");
  cy.location("pathname").should("contain", "/dashboard");
});

it("should reject files over 3MB", () => {
  cy.visitAndCheck("/dashboard");
  cy.findByRole("link", { name: /upload profile picture/i }).click();
  cy.fixture("images/cat-picture-large.png", null).then((pic) => {
    cy.findByLabelText(/upload a file/i)
      .parent() // get the upload area not the actual input
      .selectFile(
        {
          contents: pic,
          fileName: "cat-picture-large.png",
        },
        { action: "drag-drop" }
      );
  });
  cy.findByRole("alert")
    .findByRole("heading", {
      name: /cat-picture-large\.png is too large. profile photos can't be larger than 3mb/i,
    })
    .should("exist");
});

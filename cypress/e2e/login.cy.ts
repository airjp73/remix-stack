describe("login", () => {
  afterEach(() => {
    // TODO: probably need to reimplement this
    // cy.cleanupUser();
  });

  it("should log in with email and password", () => {
    const loginForm = {
      email: "existing-password-account@example.com",
      password: "testing123",
    };

    cy.visitAndCheck("/login");
    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /login/i }).click();

    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
    cy.location("pathname").should("contain", "/dashboard");
  });
});

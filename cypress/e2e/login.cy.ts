import { faker } from "@faker-js/faker";
import { z } from "zod";

const project_id = Cypress.env("FIREBASE_PROJECT_ID");
const responseSchema = z.object({
  oobCodes: z.array(
    z.object({
      email: z.string(),
      requestType: z.string(),
      oobCode: z.string(),
    })
  ),
});
const getRequestsUrl = `http://localhost:9099/emulator/v1/projects/${project_id}/oobCodes`;
const existingAccount = {
  email: "existing-password-account@example.com",
  password: "testing123",
};

describe("login", () => {
  afterEach(() => {
    // TODO: probably need to reimplement this
    // cy.cleanupUser();
  });

  it("should log in with email and password", () => {
    cy.visitAndCheck("/login");
    cy.findByRole("textbox", { name: /email/i }).type(existingAccount.email);
    cy.findByLabelText(/password/i).type(existingAccount.password);
    cy.findByRole("button", { name: /login/i }).click();

    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
    cy.location("pathname").should("contain", "/dashboard");
  });

  it("should reset password", () => {
    cy.visitAndCheck("/login");
    cy.findByRole("link", { name: /forgot your password/i }).click();
    cy.findByRole("textbox", { name: /email/i }).type(
      "forgot-password-user@example.com"
    );
    cy.findByRole("button", { name: /reset password/i }).click();
    cy.findByText(/if you entered your email correctly/i).should("exist");

    cy.request(getRequestsUrl).then((response) => {
      const { oobCodes } = responseSchema.parse(response.body);
      const request = [...oobCodes]
        .reverse()
        .find((oob) => oob.requestType === "PASSWORD_RESET");
      const oobCode = request?.oobCode;
      cy.wrap(oobCode).should("exist");
      cy.visitAndCheck(`/auth-action?mode=resetPassword&oobCode=${oobCode}`);
    });

    cy.findByLabelText(/new password/i).type("testNewPassword");
    cy.findByRole("button", { name: /update password/i }).click();
    cy.findByText(/your password has been changed/i).should("exist");
    cy.findByRole("link", { name: /back to login/i }).click();

    // Log in with new password
    cy.findByRole("textbox", { name: /email/i }).type(
      "forgot-password-user@example.com"
    );
    cy.findByLabelText(/password/i).type("testNewPassword");
    cy.findByRole("button", { name: /login/i }).click();

    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
    cy.location("pathname").should("contain", "/dashboard");
  });
});

describe("authorized visit", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow dashboard access if logged in", () => {
    // The previous test might leave us on the page we're looking for, so let's relocate first
    cy.visitAndCheck("/");
    cy.login();
    cy.visitAndCheck("/dashboard");
    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
  });
});

describe("unauthorized visit", () => {
  it("should not allow dashbaord access if logged out", () => {
    cy.visitAndCheck("/dashboard");
    cy.location("pathname").should("contain", "/login");

    cy.findByRole("textbox", { name: /email/i }).type(existingAccount.email);
    cy.findByLabelText(/password/i).type(existingAccount.password);
    cy.findByRole("button", { name: /login/i }).click();

    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
    cy.location("pathname").should("contain", "/dashboard");
  });
});

describe("signing up", () => {
  it("should create an account and verify email", () => {
    // Go to signup page through link
    cy.visitAndCheck("/login");
    cy.findByRole("link", { name: /sign up/i }).click();

    const email = faker.internet.email();
    // fill out form
    cy.findByRole("textbox", { name: /email/i }).type(email);
    cy.findByLabelText(/password/i).type("testing123");
    cy.findByRole("button", { name: /sign up/i }).click();
    cy.findByRole("heading", { name: /dashboard/i }).should("exist");
    cy.location("pathname").should("contain", "/dashboard");

    cy.request(getRequestsUrl).then((response) => {
      const { oobCodes } = responseSchema.parse(response.body);
      const request = [...oobCodes].find(
        (oob) =>
          oob.requestType === "VERIFY_EMAIL" &&
          oob.email.toLowerCase() === email.toLowerCase()
      );
      const oobCode = request?.oobCode;
      cy.wrap(oobCode).should("exist");
      cy.wait(1000);
      cy.visitAndCheck(`/auth-action?mode=verifyEmail&oobCode=${oobCode}`);
    });
    cy.findByText(/your email has been verified/i).should("exist");
    cy.findByRole("link", { name: /back to login/i }).click();
    cy.findByRole("button", { name: /login/i }).should("exist");
  });

  it("should validate the form", () => {
    cy.visitAndCheck("/signup");
    cy.findByRole("button", { name: /sign up/i }).click();
    cy.findAllByText(/this field is required/i).should("have.length", 2);
    cy.findByRole("textbox", { name: /email/i }).type("asdf");
    cy.findByText(/must be a valid email/i).should("exist");
    cy.findByLabelText(/password/i).type("asdf");
    cy.findByText(/must be at least 6 characters/i).should("exist");
  });

  it("should gracefully handle when an email is taken", () => {
    cy.visitAndCheck("/signup");
    cy.findByRole("textbox", { name: /email/i }).type(existingAccount.email);
    cy.findByLabelText(/password/i).type("notimportant");
    cy.findByRole("button", { name: /sign up/i }).click();
    cy.findByText(/an account already exists for that email/i).should("exist");
  });
});

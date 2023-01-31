import { faker } from "@faker-js/faker";
import { z } from "zod";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;

      /**
       * Deletes the current @user
       *
       * @returns {typeof cleanupUser}
       * @memberof Chainable
       * @example
       *    cy.cleanupUser()
       * @example
       *    cy.cleanupUser({ email: 'whatever@example.com' })
       */
      cleanupUser: typeof cleanupUser;

      /**
       * Fixes issues where hydration can result in different html elements being rendered.
       *
       * @returns {typeof visitAndCheck}
       * @memberof Chainable
       * @example
       *    cy.visitAndCheck('/')
       */
      visitAndCheck: typeof visitAndCheck;
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, "example.com"),
}: {
  email?: string;
} = {}) {
  return cy
    .exec(
      `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 npx ts-node --require tsconfig-paths/register --require dotenv/config ./cypress/support/create-user.ts "${email}"`
    )
    .then(({ stdout }) => {
      const [, idToken, cookie] = stdout.match(
        /.*<idToken>(?<idToken>.*)<\/idToken>.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s
      )!;
      cy.setCookie("__session", cookie.trim());
      return cy.wrap({ email, idToken: idToken.trim() });
    })
    .as("user");
}

function cleanupUser(params?: { email: string; idToken: string }) {
  if (params) {
    deleteUser(params.email, params.idToken);
  } else {
    cy.get("@user").then((user) => {
      const schema = z.object({ email: z.string(), idToken: z.string() });
      if (user) {
        const { email, idToken } = schema.parse(user);
        deleteUser(email, idToken);
      }
    });
  }
  cy.clearCookie("__session");
}

function deleteUser(email: string, idToken: string) {
  cy.exec(
    `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 npx ts-node --require tsconfig-paths/register --require dotenv/config ./cypress/support/delete-user.ts "${email}" "${idToken}"`
  );
  cy.clearCookie("__session");
}

function visitAndCheck(url: string) {
  cy.visit(url);
  cy.get('[data-hydrated="true"]').should("exist");
}

Cypress.Commands.add("login", login);
Cypress.Commands.add("cleanupUser", cleanupUser);
Cypress.Commands.add("visitAndCheck", visitAndCheck);

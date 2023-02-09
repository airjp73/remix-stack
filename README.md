# airjp73 Remix Stack

Customized version of the [Blues Stack](https://github.com/remix-run/blues-stack).

```
npx create-remix@latest --template airjp73/remix-stack
```

# Needs documentation

This stack is more-or-less finished at this point, but still requires the readme to be rewritten.

## Changes intended

- [X] Prepopulated with components some components
- [X] remix-validated-form & zod pre-installed
- [X] Example app replaced
- [X] Dark mode implemented
- [X] I18n support
- [X] Authentication with Firebase and remix-auth
  - [X] Add example of page requiring a session
  - [X] Add user info somewhere on the page
  - [X] Add "login with google"
  - [X] Add google login to signup page
  - [X] Make "remember me" button do something
  - [X] Write tests for all of this
  - [X] Add user record to DB
  - [X] Handle "email taken" error during signup
- [X] Clean up how inputs look in dark mode
- [X] Fix button hover state in dark mode
- [X] Make all grays use gray and set gray in theme
- [X] I18n for form validation errors errors
- [X] Add profile photo upload demo page
  - [X] Display photo on dashboard
  - [X] Use file upload handler instead of uploading directly to firebase
  - [X] Add profile photo to user record
  - [X] Deploy firebase rules 
- [X] Test deployment with fly
- [X] Enable github action in repo
- [X] Vercel
- [X] Planetscale
- [X] Sentry error monitoring
- [X] Retain file extension in image upload and check for valid image
- [ ] Finish readme

## What's being removed

- Email/Password Authentication

## Setup steps

- Add vercel project
- Set up checkly project
- Setup firebase project
- `npm i -g firebase-tools`
- Need a `.firebaserc` specifying the project id. `firebase init` can create one.
- Add env vars to github and vercel
- Init firebase project
- Setup firebase emulators
- Add firebase service account to secrets
- Add all env vars to fly.io secrets except DATABASE_URL. Keep current recommendation for SESSION_SCRET
- on local machine
  - firebase login:ci
  - log in
  - copy token printed in console
  - Add token as FIREBASE_CI_TOKEN to github repo secrets

## What's kept from the orignal

- [Multi-region Fly app deployment](https://fly.io/docs/reference/scaling/) with [Docker](https://www.docker.com/)
- [Multi-region Fly PostgreSQL Cluster](https://fly.io/docs/getting-started/multi-region-databases/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up, Postgres started, and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/blues-stack/tree/main)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Generate a session secret to use in your prod env.

  ```sh
  openssl rand -hex 32
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

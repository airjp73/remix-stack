import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

const env = dotenv.parse(fs.readFileSync(path.join(__dirname, ".env")));

export default defineConfig({
  env,
  e2e: {
    experimentalSessionAndOrigin: true,
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      };

      // To use this:
      // cy.task('log', whateverYouWantInTheTerminal)
      on("task", {
        log: (message) => {
          console.log(message);

          return null;
        },
      });

      return { ...config, ...configOverrides };
    },
  },
});

import { setupServer, SetupServerApi } from "msw/node";
import { rest } from "msw";
import invariant from "tiny-invariant";

declare global {
  var __MSW_SERVER: SetupServerApi | undefined;
}

const setupMockServer = () => {
  invariant(
    process.env.MOCKED,
    "Mock server should only be used in development"
  );
  if (globalThis.__MSW_SERVER) return __MSW_SERVER;

  const server = setupServer(
    rest.get("https://www.example.com", (req, res, ctx) => {
      return res(ctx.json({ message: "Hello world!!!!" }));
    })
  );

  server.listen({ onUnhandledRequest: "bypass" });

  console.info("🔶 Mock server running");

  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());
  globalThis.__MSW_SERVER = server;
};

setupMockServer();

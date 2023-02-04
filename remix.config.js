const getServer = () => {
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  if (process.env.NODE_ENV === "development") return undefined;

  // When running integ tests, we want to run it in production mode,
  // but we still don't want to use the vercel lambda module format.
  if (process.env.LOCAL_PROD) return undefined;

  return "./server.js";
};

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "vercel",
  server: getServer(),
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  future: {
    v2_routeConvention: true,
  },
};

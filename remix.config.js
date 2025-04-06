/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    ignoredRouteFiles: ["**/.*"],
    tailwind: true,
    serverModuleFormat: "esm",
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_singleFetch: true,
      v3_lazyRouteDiscovery: true
    }
  };
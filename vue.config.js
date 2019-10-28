process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  productionSourceMap: true,
  transpileDependencies: ["autotrack", "dom-utils", "idb", "vuetify"],
  devServer: {
    overlay: false
  },
  pwa: {
    name: "Harker Bell Schedule",
    themeColor: "#FFFFFF",
    msTileColor: "#005841",
    appleMobileWebAppCapable: "yes",
    workboxOptions: {
      clientsClaim: true,
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [/api/, /docs/, /admin/, /submitevent/],
      offlineGoogleAnalytics: true,
      runtimeCaching: [{
        urlPattern: "https://www.google-analytics.com/analytics.js",
        handler: "staleWhileRevalidate"
      }, {
        urlPattern: "https://qbw8rkkv7x0h.statuspage.io/embed/script.js",
        handler: "staleWhileRevalidate"
      }],
      skipWaiting: true,
    },
  },
};
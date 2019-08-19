process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["autotrack", "idb", "vuetify"],
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/sass/main.scss"`
      }
    }
  },
  pwa: {
    name: "Harker Bell Schedule",
    themeColor: "#FFFFFF",
    msTileColor: "#005841",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      short_name: "Harker Bell"
    },
    workboxOptions: {
      clientsClaim: true,
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [/api/, /docs/, /admin/],
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
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  productionSourceMap: true,
  transpileDependencies: ["autotrack", "dom-utils", "idb", "vuetify"],
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
    workboxOptions: {
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      exclude: [/_redirects/],
      navigateFallback: "/index.html",
      navigateFallbackBlacklist: [/api/, /docs/, /admin/, /submitevent/],
      offlineGoogleAnalytics: {
        parameterOverrides: {
          cd14: "offline",
        },
        hitFilter: params => {
          const queueTime = Math.round(params.get("qt")/1000);
          params.set("cm3", queueTime);
        },
      },
      runtimeCaching: [{
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: "staleWhileRevalidate",
      }, {
        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
        handler: "cacheFirst",
        options: {
          cacheName: "google-fonts-files",
          expiration: {
            maxAgeSeconds: 60*60*24*365,
            maxEntries: 30
          }
        }
      }, {
        urlPattern: "https://www.google-analytics.com/analytics.js",
        handler: "staleWhileRevalidate"
      }, {
        urlPattern: "https://ipmeta.io/plugin.js",
        handler: "staleWhileRevalidate"
      }, {
        urlPattern: "https://qbw8rkkv7x0h.statuspage.io/embed/script.js",
        handler: "staleWhileRevalidate"
      }],
      skipWaiting: true,
    },
  },
};
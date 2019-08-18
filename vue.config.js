process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
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
    msTileColor: "#FFFFFF",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      short_name: "Harker Bell"
    },
    workboxOptions: {
      clientsClaim: true,
      offlineGoogleAnalytics: true,
      runtimeCaching: [{
        urlPattern: /[0-9]+\/[0-9]+/,
        handler: "cacheFirst"
      }, {
        urlPattern: /settings/,
        handler: "cacheFirst"
      }],
      skipWaiting: true,
    },
  },
};
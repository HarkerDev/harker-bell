module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{js,css,png,json,ico,html,webmanifest}"
  ],
  globIgnores: [
    "**/data/*"
  ],
  runtimeCaching: [
    {
      handler: "NetworkFirst",
      urlPattern: /\/data\//,
    }
  ],
  skipWaiting: true,
  swDest: "dist/sw.js",
  sourcemap: false,
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/,
  ]
};
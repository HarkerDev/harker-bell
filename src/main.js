/* eslint-disable no-undef */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import {openDB} from "idb";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import "autotrack/lib/plugins/event-tracker";
import "autotrack/lib/plugins/outbound-link-tracker";
import "autotrack/lib/plugins/page-visibility-tracker";
import "autotrack/lib/plugins/url-change-tracker";

Sentry.init({
  dsn: "https://2774d8d5d9c3402fb93dd9e702e39470@sentry.dev.harker.org/11",
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  release: "harker-bell@"+process.env.VUE_APP_VERSION,
});
window.onload = () => Sentry.setTag("nodes", document.getElementsByTagName("*").length);

Vue.config.productionTip = false;

//let timestamp = new Date();
if (window.indexedDB)
  openDB("harker-bell-db", 1, {
    upgrade(db) {
      db.createObjectStore("schedules", {keyPath: "date"});
    },
  }).then(db => {
    //console.log("==> DB: ", new Date()-timestamp);
    window.db = db;
    initVue();
    //console.log("==> VUE: ", new Date()-timestamp);
  }).catch(err => {
    Sentry.captureException(err);
    window.db = null;
    initVue();
  });
else initVue();
function initVue() {
  new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
}
localStorage.setItem("appVersion", process.env.VUE_APP_VERSION);
ga("require", "eventTracker", {events: ["click", "contextmenu", "focus"]});
ga("require", "outboundLinkTracker", {
  events: ["click", "contextmenu", "auxclick"],
  shouldTrackOutboundLink: () => true});
ga("require", "pageVisibilityTracker", {visibleThreshold: 500, visibleMetricIndex: 1});
ga("require", "urlChangeTracker");
ga(trk => Sentry.setExtra("clientId", trk.get("clientId")));
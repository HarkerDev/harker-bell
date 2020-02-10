import {openDB} from "idb";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import "autotrack/lib/plugins/event-tracker";
import "autotrack/lib/plugins/outbound-link-tracker";
import "autotrack/lib/plugins/page-visibility-tracker";
import "autotrack/lib/plugins/url-change-tracker";

process.env.VERSION = require("../../package.json").version;

export default async ({Vue}) => {
  Sentry.init({
    dsn: "https://2774d8d5d9c3402fb93dd9e702e39470@sentry.dev.harker.org/11",
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
    release: "harker-bell@"+process.env.VERSION,
  });
  openDB("harker-bell-db", 1, {
    upgrade(db) {
      db.createObjectStore("schedules", {keyPath: "date"});
    },
  }).then(db => {
    Vue.prototype.db = db;
  }).catch(err => {
    Vue.prototype.db = null;
    Sentry.captureException(err);
  });
  window.localStorage.setItem("appVersion", process.env.VUE_APP_VERSION);
  ga("require", "eventTracker", {events: ["click", "contextmenu", "focus"]});
  ga("require", "outboundLinkTracker", {
    events: ["click", "contextmenu", "auxclick"],
    shouldTrackOutboundLink: () => true,
  });
  ga("require", "pageVisibilityTracker", {visibleThreshold: 500, visibleMetricIndex: 1});
  ga("require", "urlChangeTracker");
};
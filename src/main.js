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
import {getFCP, getLCP, getFID, getCLS, getTTFB} from "web-vitals";
import "./scripts/sun";

Sentry.init({
  dsn: "https://74f7b85b2e13edde2c1935d20e3623e1@o4508111680176128.ingest.us.sentry.io/4509268934918144",
  integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  release: "harker-bell@"+process.env.VUE_APP_VERSION,
  environment: process.env.NODE_ENV
});
window.onload = () => {
  setTimeout(() => Sentry.setTag("nodes", document.getElementsByTagName("*").length), 2000);
};

function saveWebVitals({name, delta, id}) {
  if (window.gtag) gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true
  });
}
getFCP(saveWebVitals);
getLCP(saveWebVitals);
getFID(saveWebVitals);
getCLS(saveWebVitals);
getTTFB(saveWebVitals);

const MS_PER_DAY = 24*60*60*1000;
/**
 * Gets the next sunrise or sunset for a given date.
 * @param {Date} date a date
 * @return {Object}   object containing a `time` and an `isSunrise` field
 */
window.getNextSunRiseSet = (date) => {
  let sunrise = date.sunrise(37.318, -121.971); // coordinates of Harker
  let sunset = date.sunset(37.318, -121.971);
  if (sunrise < date) sunrise = new Date(sunrise.getTime()+MS_PER_DAY);
  if (sunset < date) sunset = new Date(sunset.getTime()+MS_PER_DAY);
  if (sunrise < sunset) return {time: sunrise, isSunrise: true};
  else return {time: sunset, isSunrise: false};
}
/** Initializes auto dark mode and updates the current setting as necessary. */
window.initializeAutoDark = () => {
  window.nextSunRiseSet = window.getNextSunRiseSet(new Date());
  if (nextSunRiseSet.isSunrise) localStorage.setItem("darkTheme", true);
  else localStorage.setItem("darkTheme", false);
};
if (localStorage.getItem("autoDark") == "true") window.initializeAutoDark();

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
    methods: {
      /** Sends a basic event to GA */
      sendAnalyticsHit: function(actionValue, type, category, additionalData) {     
        // console.log(actionValue, type, category)
  
        if (window.gtag) window.gtag('event', category, {
          'value': actionValue,
          'hit_type': type,
          'hit_time': new Date().getTime(),
          'timestamp_minutes': Math.floor(new Date().getTime() / 60000) * 60000,
          'clock': new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(new Date()),
          'branch': window.nf_branch,

          ...additionalData
        });
      }
    },
    render: h => h(App),
  }).$mount("#app");
}
localStorage.setItem("appVersion", process.env.VUE_APP_VERSION);

gtag('set', 'user_properties', { 'appVersion': process.env.VUE_APP_VERSION || "not set" }); // dimension5
if (window.GA_MEASUREMENT_ID) gtag('get', window.GA_MEASUREMENT_ID, 'client_id', function(clientId) {
  Sentry.setTag("clientId", clientId)
});

ga("require", "eventTracker", {events: ["click", "contextmenu", "focus"]});
ga("require", "outboundLinkTracker", {
  events: ["click", "contextmenu", "auxclick"],
  shouldTrackOutboundLink: () => true});
ga("require", "pageVisibilityTracker", {visibleThreshold: 500, visibleMetricIndex: 1});
ga("require", "urlChangeTracker");
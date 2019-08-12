import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import {openDB} from "idb";
//import "roboto-fontface/css/roboto/roboto-fontface.css";
//import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto";
import "typeface-pt-sans";
import "./material-icons.css";

Vue.config.productionTip = false;

let timestamp = new Date();
openDB("harker-bell-db", 1, {
  upgrade(db) {
    db.createObjectStore("schedules", {keyPath: "date"});
  },
}).then(db => {
  window.db = db;
  initVue();
  console.log("==> VUE: ", new Date()-timestamp);
}).catch(err => {
  console.error(err);
  window.db = null;
  initVue();
});
function initVue() {
  var app = new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
  window.app = app;
}
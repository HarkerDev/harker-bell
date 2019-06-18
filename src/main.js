import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
//import "roboto-fontface/css/roboto/roboto-fontface.css";
//import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto";
import "typeface-pt-sans";
import "./material-icons.css";

Vue.config.productionTip=false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
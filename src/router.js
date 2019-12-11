import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/index.html",
      name: "index",
      component: Home
    },
    {
      path: "/settings",
      name: "settings",
      component: Home
    },
    {
      path: "/:year/:month",
      name: "month",
      component: Home
    },
    {
      path: "/:year/:month/:day",
      name: "day",
      component: Home
    },
  ]
});
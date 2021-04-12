import {createApp, h} from "vue";
import App from "./App.vue";
import "./index.css";
//import schedules from "./data/schedules.json";

var schedules;
var start=new Date;
console.log(start);
console.log("start");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

const VueApp = {
  data: () => ({
    currentRoute: window.location.pathname,
    schedules: null,
  }),
  computed: {
    
  },
  render() {
    return h(App);
  },
  async created() {
    window.addEventListener("popstate", () => {
      this.currentRoute = window.location.pathname;
    });
    if (localStorage.colorTheme == "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    console.log(new Date-start);
    fetch("/data/schedules.json", {
      method: "GET",
      credentials: "include",
      mode: "no-cors",
    }).then(response => { this.schedules = response.json(); console.log(new Date - start) });
  }
}
createApp(VueApp).mount("#app");

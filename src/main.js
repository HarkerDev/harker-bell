import {createApp, h} from "vue";
import App from "./App.vue";
import "./index.css";
import schedules from "./data/schedules.json";

console.log(schedules);
const VueApp = {
  data: () => ({
    currentRoute: window.location.pathname,
    schedules,
  }),
  computed: {
    
  },
  render() {
    return h(App);
  },
  created() {
    window.addEventListener("popstate", () => {
      this.currentRoute = window.location.pathname;
    });
  }
}
createApp(VueApp).mount("#app");

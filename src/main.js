import {createApp, h} from "vue";
import App from "./App.vue";
import "./index.css";
//import schedules from "./data/schedules.json";

var schedules;
var start=new Date;
console.log(start);
console.log("start");
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
    console.log(new Date-start);
    fetch("/data/schedules.json", {
      method: "GET",
      credentials: "include",
      mode: "no-cors",
    }).then(response => { this.schedules = response.json(); console.log(new Date - start) });
  }
}
createApp(VueApp).mount("#app");

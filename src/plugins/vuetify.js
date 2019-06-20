import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#188038",
        secondary: "#1A73E8",
        accent: "#34A853",
        error: "#EA4335",
        warning: "#FBC117",
        success: "#34A853",
        info: "#4285F4",
        anchor: "#1A73E8",
      },
      dark: {
        primary: "#188038",
        secondary: "#185ABC",
        accent: "#34A853",
        error: "#EA4335",
        warning: "#FBC117",
        success: "#34A853",
        info: "#1A73E8",
        anchor: "#8AB4F8"
      },
    },
    options: {
      customProperties: true
    },
  },
  icons: {
    iconfont: "md"
  },
});

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#FFFFFF",
        secondary: "#80868B",
        accent: "#005841",
        error: "#EA4335",
        warning: "#FBBC04",
        success: "#1E8E3E",
        info: "#4285F4",
        anchor: "#1A73E8",
      },
      dark: {
        primary: "#37383B",
        secondary: "#9AA0A6",
        accent: "#098060",
        error: "#EA4335",
        warning: "#FBBC04",
        success: "#34A853",
        info: "#4285F4",
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

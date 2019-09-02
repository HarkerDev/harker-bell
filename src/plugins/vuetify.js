import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#FFFFFF",
        secondary: "#BDC1C6",
        accent: "#005841",
        error: "#EA4335",
        warning: "#FBBC04",
        success: "#1E8E3E",
        info: "#4285F4",
        anchor: "#1A73E8",
        red2: {lighten5: "#FCE8E6", darken4: "#C5221F"},
        deeporange2: {lighten5: "#FEEDE8", darken4: "#FA7B17"},
        orange2: {lighten5: "#FEEFE3", darken4: "#E37400"},
        //amber2: {lighten5: "#FEF0C3", darken4: "#C7853A"},
        yellow2: {lighten5: "#FEF7E0", darken4: "#B06000"},
        //lime2: {lighten5: "#FEF7E0", darken4: "#B06000"},
        lightgreen2: {lighten5: "#E9FAF7", darken4: "#027E5A"},
        green2: {lighten5: "#E6F4EA", darken4: "#0D652D"},
        teal2: {lighten5: "#E4F7FB", darken4: "#00796B"},
        //cyan2: {lighten5: "#E6F9F6", darken4: "#3B9DA5"},
        lightblue2: {lighten5: "#F6FAFE", darken4: "#047CBD"},
        blue2: {lighten5: "#E8F0FE", darken4: "#174EA6"},
        indigo2: {lighten5: "#F1F5FA", darken4: "#1E267D"},
        //deeppurple2: {lighten5: "#F4EAFF", darken4: "#5011C1"},
        purple2: {lighten5: "#F3E8FD", darken4: "#9345BD"},
        pink2: {lighten5: "#FDE7F3", darken4: "#B80672"},
        //brown2: {lighten5: "#FFFFFF", darken4: "#000000"},
        bluegrey2: {lighten5: "#E8EAED", darken4: "#2C323D"},
        grey2: {lighten5: "#FFFFFF", darken4: "#202124"},
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

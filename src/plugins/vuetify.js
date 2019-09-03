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
        red2: {lighten5: "#FAEAEE", darken4: "#CF2035"},
        deeporange2: {lighten5: "#FEEDE8", darken4: "#FA7B17"},
        orange2: {lighten5: "#FEEFE3", darken4: "#B36600"},
        yellow2: {lighten5: "#FEF7E0", darken4: "#B06000"},
        lightgreen2: {lighten5: "#E9FAF7", darken4: "#027E5A"},
        green2: {lighten5: "#E6F4EA", darken4: "#137333"},
        teal2: {lighten5: "#E4F7FB", darken4: "#007B86"},
        lightblue2: {lighten5: "#F6FAFE", darken4: "#047CBD"},
        blue2: {lighten5: "#E9EEFF", darken4: "#2A56C6"},
        indigo2: {lighten5: "#F1F5FA", darken4: "#1E267D"},
        purple2: {lighten5: "#F4EAFF", darken4: "#9345BD"},
        pink2: {lighten5: "#FDE7F3", darken4: "#B80672"},
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
        anchor: "#8AB4F8",
        red2: {lighten5: "#534343", darken4: "#F6AEA9"},
        deeporange2: {lighten5: "#634947", darken4: "#F5BBA9"},
        orange2: {lighten5: "#635247", darken4: "#F5CBA9"},
        yellow2: {lighten5: "#554C33", darken4: "#FDD663"},
        lightgreen2: {lighten5: "#374A41", darken4: "#9DEDB4"},
        green2: {lighten5: "#37493F", darken4: "#7FD095"},
        teal2: {lighten5: "#31504C", darken4: "#00DCB0"},
        lightblue2: {lighten5: "#474D58", darken4: "#A6C5F9"},
        blue2: {lighten5: "#394456", darken4: "#8AB4F8"},
        indigo2: {lighten5: "#223957", darken4: "#87A3FF"},
        purple2: {lighten5: "#473A57", darken4: "#BBB3FF"},
        pink2: {lighten5: "#4F2F43", darken4: "#FDB0C9"},
        bluegrey2: {lighten5: "#3C4043", darken4: "#E8EAED"},
        grey2: {lighten5: "#202124", darken4: "#FFFFFF"},
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

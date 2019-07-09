<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-spacer></v-spacer>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="hidden-print-only" icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </template>
        <span>Previous</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="hidden-print-only" icon>
            <v-icon>date_range</v-icon>
          </v-btn>
        </template>
        <span>Jump to date</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="hidden-print-only mr-2" icon>
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </template>
        <span>Next</span>
      </v-tooltip>
      <v-toolbar-title class="headline font-family pt-sans font-weight-bold">Harker Bell Schedule</v-toolbar-title>
      <v-menu offset-y>
        <template v-slot:activator="{on: menu}">
          <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
            <template v-slot:activator="{on: tooltip}">
              <v-btn v-on="{...tooltip, ...menu}" class="hidden-print-only ml-2" icon>
                <v-icon>settings</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="$router.push('/settings')">
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense subheader>
          <v-subheader>Change view</v-subheader>
          <v-list-item @click="$vuetify.breakpoint.xsOnly?changeMode('day'):''" :disabled="$vuetify.breakpoint.smAndUp">
            <v-list-item-icon>
              <v-icon v-if="mode=='day'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
              <v-list-item-subtitle>Mobile devices only</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeMode('week')">
            <v-list-item-icon>
              <v-icon v-if="mode=='week'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeMode('month')">
            <v-list-item-icon>
              <v-icon v-if="mode=='month'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item @click="print">
            <v-list-item-content>
              <v-list-item-title>Print</v-list-item-title>
              <v-list-item-subtitle v-if="$vuetify.theme.dark">Light theme recommended</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="text--secondary">&#8984;P</v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content style="overflow-x: scroll;">
      <router-view @show-menu="showMenu($event)" :mode="mode" :sheet-id="menu.open ? menu.sheetId : null"></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" @input="closeSettings()" :fullscreen="$vuetify.breakpoint.xsOnly" width="480">
      <v-card>
        <v-app-bar elevate-on-scroll>
          <v-btn @click="closeSettings()" icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-family pt-sans font-weight-bold">Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="overline">Version {{env.VUE_APP_VERSION}}</div>
        </v-app-bar>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              Use dark theme
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="$vuetify.theme.dark"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-layout justify-center>
            <a href="https://www.netlify.com" target="_blank">
              <v-img height="51" :src="require('./assets/'+($vuetify.theme.dark?'netlify-dark.svg':'netlify-light.svg'))"></v-img>
            </a>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu v-model="menu.open" absolute :close-on-content-click="false" offset-x :position-x="menu.x" :position-y="menu.y">
      <v-card height="100">
        <v-card-text>what's not for lunch</v-card-text>
      </v-card>
    </v-menu>
  </v-app>
</template>

<script>
export default {
  name: "App",
  created() {
    let darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme) this.$vuetify.theme.dark = darkTheme === "true";
  },
  data() {
    return {
      env: process.env,
      mode: "week",
      menu: {
        open: false,
        openTracker: 0,
        sheetId: null,
        x: 0,
        y: 0,
      },
      settings: {
        dialog: this.$route.name == "settings",
      },
      prevRoute: null,
    };
  },
  methods: {
    changeMode(mode) {
      //this.$nextTick(() => {
        this.mode = mode;
      //});
    },
    closeSettings() {
      if (this.prevRoute) this.$router.back();
      else this.$router.push("/");
    },
    /** Prints the current view of the bell schedule. */
    print() {
      setTimeout(() => {
        window.print();
      }, 100);
    },
    /**
     * Opens the panel displaying the lunch menu next to the appropriate date when the show-menu event is emitted.
     * @param {VueComponent} a v-sheet component corresponding to the lunch date whose menu should be shown
     */
    showMenu(id) {
      this.menu.sheetId = id;
      if (this.menu.open) {
        this.menu.openTracker = 2;
        this.menu.open = false; // required in order for the position transition to work
      }
      let rect = document.getElementById(id).getBoundingClientRect();
      this.menu.x = rect.left+rect.width;
      this.menu.y = rect.top;
      this.$nextTick(() => {
        this.menu.open = true;
      });
    },
  },
  watch: {
    $route(route, prevRoute) {
      this.prevRoute = prevRoute;
      this.settings.dialog = route.name == "settings";
    },
    "menu.open"(open) {
      if (open == false && this.menu.openTracker > 0)
        this.$nextTick(() => {
          this.menu.open = true;
          this.menu.openTracker--;
        });
    },
    "$vuetify.theme.dark"() {
      localStorage.setItem("darkTheme", this.$vuetify.theme.dark);
    },
  },
};
</script>

<style>
.font-family.pt-sans {
  font-family: "PT Sans", sans-serif !important;
}
@media print {
  @page {
    size: landscape;
  }
}
</style>
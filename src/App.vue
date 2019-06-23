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
          <v-list-item @click="settings.dialog=true">
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
      <router-view></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" :fullscreen="$vuetify.breakpoint.xsOnly" width="480">
      <v-card>
        <v-app-bar elevate-on-scroll>
          <v-btn @click="settings.dialog=false" icon>
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
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      env: process.env,
      mode: "week",
      settings: {
        dialog: false,
      },
    };
  },
  methods: {
    changeMode(mode) {
      this.$nextTick(() => {
        this.mode = mode;
      });
    },
    print() {
      window.print();
    }
  }
};
</script>

<style>
.font-family.pt-sans {
  font-family: "PT Sans", sans-serif !important;
}
</style>
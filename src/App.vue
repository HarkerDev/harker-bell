<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-spacer></v-spacer>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </template>
        <span>Previous</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" icon>
            <v-icon>date_range</v-icon>
          </v-btn>
        </template>
        <span>Jump to date</span>
      </v-tooltip>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn class="mr-2" v-on="on" icon>
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
              <v-btn v-on="{...tooltip, ...menu}" class="ml-2" icon>
                <v-icon>settings</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="">
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list subheader>
          <v-subheader>Change view</v-subheader>
          <v-list-item @click="$vuetify.breakpoint.xsOnly?changeMode('day'):''" :disabled="$vuetify.breakpoint.smAndUp" two-line>
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
      </v-menu>
      <v-spacer></v-spacer>
    </v-app-bar>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      mode: "week"
    }
  },
  methods: {
    changeMode(mode) {
      this.$nextTick(() => {
        this.mode=mode;
      });
    }
  }
};
</script>

<style>
.font-family.pt-sans {
  font-family: "PT Sans", sans-serif !important;
}
</style>
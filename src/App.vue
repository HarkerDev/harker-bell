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
          <v-list-item @click="(true||$vuetify.breakpoint.xsOnly) ? changeMode('day') : ''" :disabled="false&&$vuetify.breakpoint.smAndUp">
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
      <router-view @show-menu="showMenu($event)" :calendar="calendar" :mode="mode" :sheet-id="menu.open ? menu.sheetId : null"></router-view>
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
    /** Number of milliseconds in a day */
    window.MS_PER_DAY = 24*60*60*1000;
    let darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme) this.$vuetify.theme.dark = darkTheme === "true";
    this.setCalendar(this.$route);
  },
  data() {
    return {
      env: process.env,
      mode: localStorage.getItem("calendarMode") || "week",
      calendar: {
        currentDate: this.getCurrentUTCMidnight(),
        currentMonth: new Date().getMonth(),
        dates: [],
      },
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
      localStorage.setItem("calendarMode", mode);
      this.mode = mode;
      this.setCalendar(this.$route);
    },
    closeSettings() {
      if (this.prevRoute) this.$router.back();
      else this.$router.push("/");
    },
    /**
     * Calculates the start of the current day, which is defined as the last midnight on or before the current
     * timestamp, and expressed in UTC time.
     * @return {Date} midnight in UTC of the current time
     */
    getCurrentUTCMidnight() {
      let now = new Date();
      let date = new Date(now-now.getTimezoneOffset()*60*1000);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    /**
     * Calculates the date of the last sunday on or before a given date.
     * @param {Date} date the date to use for calculating sunday
     * @return {Date}     the latest sunday on or before date
     */
    getSunday(date) {
      date.setUTCDate(date.getUTCDate()-date.getUTCDay());
      return date;
    },
    /** Prints the current view of the bell schedule. */
    print() {
      setTimeout(() => {
        window.print();
      }, 100);
    },
    /**
     * Sets the calendar dates that will be displayed to the user based on the current view setting
     * and the date specified in the URL path.
     * @param {Route} route the current route object
     */
    setCalendar(route) {
      let year = +route.params.year, month = +route.params.month;
      /** @type {Date} */
      let startDate, endDate;
      if (this.mode == "month") {
        if (route.name == "month") {
          this.calendar.currentMonth = month-1;
          startDate = this.getSunday(new Date(Date.UTC(year, month-1))); // first week of month
          // need to add 5 days to the previous sunday to get friday of the last week of the month
          endDate = new Date(this.getSunday(new Date(Date.UTC(year, month, 0))).getTime()+5*MS_PER_DAY);
        } else {
          let date = this.getCurrentUTCMidnight();
          this.calendar.currentMonth = date.getUTCMonth();
          // sunday of the last day of the month, plus 5 days (a.k.a. friday of the last week)
          endDate = new Date(this.getSunday(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, 0))).getTime()+5*MS_PER_DAY);
          date.setUTCDate(1); // first day of current month
          startDate = this.getSunday(date); // sunday of the first week
        }
      } else if (this.mode == "week") {
        if (route.name == "day")
          startDate = this.getSunday(new Date(Date.UTC(year, month-1, +route.params.day))); // date in URL
        else
          startDate = this.getSunday(this.getCurrentUTCMidnight()); // sunday of the current week
        endDate = new Date(startDate.getTime()+5*MS_PER_DAY); // add 5 days to get friday
      } else if (route.name == "day") // is day mode
        startDate = endDate = new Date(Date.UTC(year, month-1, +route.params.day)); // date specified in URL
      else // if no date specified in URL path
        startDate = endDate = this.getCurrentUTCMidnight();
      this.calendar.dates = [];
      while (startDate <= endDate) {
        if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
          this.calendar.dates.push(startDate);
        startDate = new Date(startDate.getTime()+MS_PER_DAY); // add 1 day
      }
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
      if (["home", "day", "month"].includes(route.name)) this.setCalendar(route);
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
.v-application .font-family.pt-sans {
  font-family: "PT Sans", sans-serif !important;
}
@media print {
  @page {
    size: landscape;
  }
}
</style>
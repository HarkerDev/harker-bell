<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-spacer></v-spacer>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="hidden-print-only" icon @click="nextOrPrevious(false)">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </template>
        <span>Previous {{mode}}</span>
      </v-tooltip>
      <v-menu v-model="datePicker" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{on: menu}">
          <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
            <template v-slot:activator="{on: tooltip}">
              <v-btn v-on="{...tooltip, ...menu}" class="hidden-print-only" icon>
                <v-icon>date_range</v-icon>
              </v-btn>
            </template>
            <span>Select a date</span>
          </v-tooltip>
        </template>
        <v-date-picker v-model="currentDateString" :allowed-dates="allowedDate" :type="mode == 'month' ? 'month' : 'date'" @input="datePicker = false">
          
        </v-date-picker>
      </v-menu>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn v-on="on" class="hidden-print-only mr-2" icon @click="nextOrPrevious(true)">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </template>
        <span>Next {{mode}}</span>
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
    <v-dialog v-model="settings.dialog" @input="closeSettings()" eager :fullscreen="$vuetify.breakpoint.xsOnly" width="480">
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
    this.$MS_PER_DAY = 24*60*60*1000;
    let darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme) this.$vuetify.theme.dark = darkTheme === "true";
    this.setCalendar(this.$route);
    window.addEventListener("keyup", event => {
      if (event.key == "ArrowRight" || event.keyCode == 39) this.nextOrPrevious(true);
      else if (event.key == "ArrowLeft" || event.keyCode == 37) this.nextOrPrevious(false);
    });
  },
  data() {
    return {
      env: process.env,
      mode: localStorage.getItem("calendarMode") || "week",
      calendar: {
        currentDate: null,
        currentMonth: null,
        dates: [],
      },
      menu: {
        open: false,
        openTracker: 0,
        sheetId: null,
        x: 0,
        y: 0,
      },
      datePicker: false,
      settings: {
        dialog: this.$route.name == "settings",
      },
      prevRoute: null,
    };
  },
  computed: {
    currentDateString: {
      get() {
        let date = this.calendar.currentDate.toISOString()
        if (this.mode == "month") return date.substring(0, 7);
        return date.substring(0, 10);
      },
      set(value) {
        let date = new Date(value), today = this.getCurrentUTCMidnight();
        if (+date == +today ||
            this.mode == "month" && date.getUTCMonth() == today.getUTCMonth())
          this.$router.push("/");
        else if (this.mode == "month")
          this.$router.push(`/${value.substring(0, 4)}/${+value.substring(5, 7)}`);
        else
          this.$router.push(`/${value.substring(0, 4)}/${+value.substring(5, 7)}/${+value.substring(8, 10)}`);
      }
    }
  },
  methods: {
    /**
     * Determines if the date represented by a given ISO date is allowed in the date picker.
     * @param dateString {string} date as an ISO date string (YYYY-MM-DD format)
     * @return                    true if the date falls on a weekday or it is month mode; otherwise, false
     */
    allowedDate(dateString) {
      if (this.mode == "month") return true;
      let date = new Date(dateString);
      return date.getUTCDay() > 0 && date.getUTCDay() < 6;
    },
    changeMode(mode) {
      localStorage.setItem("calendarMode", mode);
      this.mode = mode;
      let today = this.getCurrentUTCMidnight(), date = new Date(+this.calendar.currentDate);
      if (mode == "month" && this.$route.name == "day")
        if (new Date(+date).setUTCDate(1) == new Date(+today).setUTCDate(1))
          this.$router.push("/");
        else
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}`);
      else if (mode == "week" && this.$route.name == "day" && +this.getSunday(date) == +this.getSunday(today))
        this.$router.push("/");
      else if (this.$route.name == "month")
        if (new Date(+date).setUTCDate(1) == new Date(+today).setUTCDate(1))
          this.$router.push("/");
        else
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`);
      else this.setCalendar(this.$route);
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
    /**
     * 
     * @param isNext {boolean}  true if next; false if previous
     */
    nextOrPrevious(isNext) {
      let sign = isNext ? 1 : -1;
      let today = this.getCurrentUTCMidnight(), date = new Date(+this.calendar.currentDate);
      if (this.mode == "month")
        date.setUTCMonth(date.getUTCMonth()+sign*1);
      else if (this.mode == "week")
        date.setUTCDate(date.getUTCDate()+sign*7);
      // if going next and it's a friday, then skip directly to monday, and vice versa
      else if (isNext && date.getUTCDay() == 5 || !isNext && date.getUTCDay() == 1)
        date.setUTCDate(date.getUTCDate()+sign*3);
      else // day mode
        date.setUTCDate(date.getUTCDate()+sign*1);
      if (+date == +today ||
          this.mode == "month" && new Date(+date).setUTCDate(1) == new Date(+today).setUTCDate(1))
        this.$router.push("/");
      else if (this.mode == "month")
        this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}`);
      else
        this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`);
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
     * @param {Route} route             the current route object
     * @param {boolean} keepCurrentDate whether to avoid updating the currentDate variable
     *                                  (for use when only the mode is changing and not the date)
     */
    setCalendar(route, keepCurrentDate) {
      let year = +route.params.year, month = +route.params.month, day = +route.params.day;
      if (!keepCurrentDate && year && month) this.calendar.currentDate = new Date(Date.UTC(year, month-1, day || 1));
      else if (!keepCurrentDate) this.calendar.currentDate = this.getCurrentUTCMidnight();
      this.calendar.currentMonth = null;
      /** @type {Date} */
      let startDate, endDate;
      if (this.mode == "month") {
        if (route.name == "month") {
          this.calendar.currentMonth = month-1;
          startDate = this.getSunday(new Date(Date.UTC(year, month-1))); // first week of month
          // need to add 5 days to the previous sunday to get friday of the last week of the month
          endDate = new Date(+this.getSunday(new Date(Date.UTC(year, month, 0)))+5*this.$MS_PER_DAY);
        } else {
          let date = this.getCurrentUTCMidnight();
          this.calendar.currentMonth = date.getUTCMonth();
          // sunday of the last day of the month, plus 5 days (a.k.a. friday of the last week)
          endDate = new Date(+this.getSunday(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, 0)))+5*this.$MS_PER_DAY);
          date.setUTCDate(1); // first day of current month
          startDate = this.getSunday(date); // sunday of the first week
        }
      } else if (this.mode == "week") {
        if (route.name == "day")
          startDate = this.getSunday(new Date(Date.UTC(year, month-1, day))); // date in URL
        else
          startDate = this.getSunday(this.getCurrentUTCMidnight()); // sunday of the current week
        endDate = new Date(+startDate+5*this.$MS_PER_DAY); // add 5 days to get friday
      } else if (route.name == "day") // is day mode
        startDate = endDate = new Date(Date.UTC(year, month-1, day)); // date specified in URL
      else // if no date specified in URL path
        startDate = endDate = this.getCurrentUTCMidnight();
      this.calendar.dates = [];
      while (startDate <= endDate) {
        if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
          this.calendar.dates.push(startDate);
        startDate = new Date(+startDate+this.$MS_PER_DAY); // add 1 day
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
      if (this.mode != "month" && route.name == "month") this.mode = "month";
      else if (this.mode == "month" && route.name == "day") this.mode = "week";
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
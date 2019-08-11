<template>
  <v-app>
    <v-app-bar app elevate-on-scroll>
      <v-spacer></v-spacer>
      <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
        <template v-slot:activator="{on}">
          <v-btn class="hidden-print-only" icon v-on="on" @click="nextOrPrevious(false)">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </template>
        <span>Previous {{mode}}</span>
      </v-tooltip>
      <v-menu v-model="datePicker" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{on: menu}">
          <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
            <template v-slot:activator="{on: tooltip}">
              <v-btn class="hidden-print-only" icon v-on="{...tooltip, ...menu}">
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
          <v-btn class="hidden-print-only mr-2" icon v-on="on" @click="nextOrPrevious(true)">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </template>
        <span>Next {{mode}}</span>
      </v-tooltip>
      <transition name="fade" mode="out-in">
        <v-toolbar-title v-if="calendar.changing" key="changing" class="title font-family pt-sans font-weight-bold text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '215px' : '142px'}">
          <template v-if="$vuetify.breakpoint.smAndUp">
            <span v-if="mode == 'month'">{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCFullYear()}}</span>
            <span v-else-if="mode == 'week'">{{shortMonths[calendar.dates[0].getUTCMonth()]}} {{calendar.dates[0].getUTCDate()}} &ndash; {{shortMonths[calendar.dates[calendar.dates.length-1].getUTCMonth()]}} {{calendar.dates[calendar.dates.length-1].getUTCDate()}}, {{calendar.dates[calendar.dates.length-1].getUTCFullYear()}}</span>
            <span v-else>{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCDate()}}, {{calendar.currentDate.getUTCFullYear()}}</span>
          </template><template v-else>
            <span v-if="mode == 'month'">{{shortMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCFullYear()}}</span>
            <span v-else-if="mode == 'week'">{{shortMonths[calendar.dates[0].getUTCMonth()]}} {{calendar.dates[0].getUTCDate()}} - {{shortMonths[calendar.dates[calendar.dates.length-1].getUTCMonth()]}} {{calendar.dates[calendar.dates.length-1].getUTCDate()}}</span>
            <span v-else>{{shortMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCDate()}}, {{calendar.currentDate.getUTCFullYear()}}</span>
          </template>
        </v-toolbar-title>
        <v-toolbar-title v-else key="title" class="headline font-family pt-sans font-weight-bold text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '215px' : '142px', cursor: 'pointer'}" @click="changeTitle">
          <span v-if="$vuetify.breakpoint.smAndUp">Harker </span>Bell Schedule
        </v-toolbar-title>
      </transition>
      <v-menu offset-y>
        <template v-slot:activator="{on: menu}">
          <v-tooltip bottom open-delay="500" transition="scale-transition" origin="top center">
            <template v-slot:activator="{on: tooltip}">
              <v-btn class="hidden-print-only ml-2" icon v-on="{...tooltip, ...menu}">
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
          <v-list-item :disabled="false&&$vuetify.breakpoint.smAndUp" @click="(true||$vuetify.breakpoint.xsOnly) ? changeMode('day') : ''">
            <v-list-item-icon>
              <v-icon v-if="mode == 'day'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
              <v-list-item-subtitle>Mobile devices only</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeMode('week')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'week'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeMode('month')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'month'">check</v-icon>
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
      <router-view :calendar="calendar" :mode="mode" :schedules="schedules" :sheet-id="menu.open ? menu.sheetId : null" @show-menu="showMenu($event)"></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" eager :fullscreen="$vuetify.breakpoint.xsOnly" width="480" @input="closeSettings">
      <v-card>
        <v-app-bar elevate-on-scroll>
          <v-btn icon @click="closeSettings()">
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
    <v-footer app color="white" elevation="2" fixed padless>
      <div class="caption mx-2">
        <span>Last connected </span>
        <span :class="{'success--text': io.connected}">{{io.connected ? "just now" : io.lastConnected || "never"}}</span>
      </div>
      <v-spacer></v-spacer>
      <div class="caption mx-2">
        <span>Last updated </span>
        <span>{{io.lastUpdated || "never"}}</span>
      </div>
    </v-footer>
    <v-snackbar v-model="snackbars.offlineReady">hi</v-snackbar>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import {openDB} from "idb";
var abcd = new Date;
export default {
  name: "App",
  data() {
    return {
      env: process.env,
      socket: io("http://localhost:5000"/*"https://bell.dev.harker.org"*/, {timeout: 10000}),
      io: {
        connected: false,
        lastConnected: localStorage.getItem("lastConnected") || null,
        lastUpdated: localStorage.getItem("lastUpdated") || null,
      },
      db: null,
      mode: localStorage.getItem("calendarMode") || "week",
      schedules: [],
      calendar: {
        currentDate: null,
        currentMonth: null,
        dates: [],
        keepCurrentDate: false,
        changing: false,
        timeout: null,
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
      snackbars: {
        offlineReady: true
      },
      prevRoute: null,
      features: {
        indexedDB: window.indexedDB ? true : false,
      },
      longMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };
  },
  computed: {
    currentDateString: {
      /** Returns the current date as an ISO string for date picker purposes. */
      get() {
        let date = this.calendar.currentDate.toISOString()
        if (this.mode == "month") return date.substring(0, 7);
        return date.substring(0, 10);
      },
      /**
       * When set, the underlying date variable is also updated to reflect the changes.
       * @param {string} value  date string in ISO format
       */
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
  watch: {
    /** Responds to route changes. */
    $route(route, prevRoute) {
      this.prevRoute = prevRoute;
      this.settings.dialog = route.name == "settings";
      if (this.mode != "month" && route.name == "month") this.saveMode(this.mode = "month");
      else if (this.mode == "month" && route.name == "day") this.saveMode(this.mode = "week");
      if (["home", "day", "month"].includes(route.name)) this.setCalendar(route);
    },
    /** Responds to lunch menu changes by keeping it open when choosing a different date. */
    "menu.open"(open) {
      if (open == false && this.menu.openTracker > 0)
        this.$nextTick(() => {
          this.menu.open = true;
          this.menu.openTracker--;
        });
    },
    /** Handles changes to the dark mode setting. */
    "$vuetify.theme.dark"(dark) {
      localStorage.setItem("darkTheme", dark);
      if (dark) document.querySelector('meta[name="theme-color"]').setAttribute("content",  "#202124");
      else document.querySelector('meta[name="theme-color"]').setAttribute("content",  "#FFFFFF");
    },
  },
  created() {
    console.log(new Date-abcd);
    /** Number of milliseconds in a day */
    this.$MS_PER_DAY = 24*60*60*1000;
    console.log("#0:\t", new Date-abcd);
    if (localStorage.getItem("darkTheme") == "true") {
      this.$vuetify.theme.dark = true;
      document.querySelector('meta[name="theme-color"]').setAttribute("content",  "#202124");
    }
    console.log("#1:\t", new Date-abcd);
    openDB("harker-bell-db", 1, {
      upgrade(db) {
        db.createObjectStore("schedules", {keyPath: "date"});
      },
    }).then(db => {
      console.log("#2:\t", new Date-abcd);
      this.db = db;
      window.dispatchEvent(new Event("db-opened"));
    }).catch(err => {
      console.error(err);
    });
    console.log("#3:\t", new Date-abcd);
    this.socket.on("connect", () => {
      console.log("#3.1:\t", new Date-abcd);
      this.io.connected = true;
      console.log(this.socket.id);
      this.socket.emit("schedule request", {
        start: this.calendar.dates[0],
        end: this.calendar.dates[this.calendar.dates.length-1]
      }, schedules => {
        console.log("#3.2:\t", new Date-abcd);
        this.schedules = schedules;
        console.log(this.db);
        // might get this data back before this.db is even opened, so consider using eventlisteners to wait until the db is initialized before storing schedules.
      });
    });
    this.socket.on("disconnect", reason => {
      this.io.connected = false;
      console.log(reason);
    });
    this.socket.on("test", value => {
      console.log(value);
    });
    this.socket.on("schedule update", details => {
      
    });
    this.socket.on("pong", () => {
      let now = new Date();
      this.lastConnected = now;
      localStorage.setItem("lastConnected", now.getTime());
    });
    console.log("#4:\t", new Date-abcd);
    this.setCalendar(this.$route);
    console.log("#5:\t", new Date-abcd);
    window.addEventListener("keyup", event => {
      if (event.key == "ArrowRight" || event.keyCode == 39) this.nextOrPrevious(true);
      else if (event.key == "ArrowLeft" || event.keyCode == 37) this.nextOrPrevious(false);
    });
    console.log("#6:\t", new Date-abcd);
  },
  methods: {
    /**
     * Determines if the date represented by a given ISO date is allowed in the date picker.
     * @param {string} dateString date as an ISO date string (YYYY-MM-DD format)
     * @return                    true if the date falls on a weekday or it is month mode; otherwise, false
     */
    allowedDate(dateString) {
      if (this.mode == "month") return true;
      let date = new Date(dateString);
      return date.getUTCDay() > 0 && date.getUTCDay() < 6;
    },
    /**
     * Changes the calendar display mode.
     * @param {string} mode the mode to change the view to (either "day", "week", or "month")
     */
    changeMode(mode) {
      let prevMode = this.mode;
      this.saveMode(this.mode = mode);
      this.calendar.keepCurrentDate = true;
      let today = this.getCurrentUTCMidnight(), date = new Date(+this.calendar.currentDate);
      if (mode == "month" && this.$route.name == "day")
        if (new Date(+date).setUTCDate(1) == new Date(+today).setUTCDate(1))
          this.$router.push("/");
        else
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}`);
      else if (mode != "month" && this.$route.name == "month")
        if (new Date(+date).setUTCDate(1) == new Date(+today).setUTCDate(1))
          this.$router.push("/");
        else
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`);
      else if (mode == "week" && this.$route.name == "day" &&
              +this.getSunday(new Date(+date)) == +this.getSunday(new Date(+today)))
        this.$router.push("/");
      else if (mode != "month" && prevMode == "month" &&
              (mode == "week" && +this.getSunday(new Date(+date)) != +this.getSunday(new Date(+today)) ||
              mode == "day" && +date != +today))
        this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`);
      else this.setCalendar(this.$route);
    },
    /** Changes the bell schedule title to briefly show the current date range. */
    changeTitle() {
      if (this.calendar.timeout) {
        this.calendar.changing = true;
        clearTimeout(this.calendar.timeout);
        this.calendar.timeout = setTimeout(() => {this.calendar.changing = false;}, 2000);
      } else this.calendar.timeout = true;
    },
    /** Closes the settings dialog by either navigating back in history or going to the home page. */
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
     * Navigates to the next or previous view, depending on the current calendar mode selected.
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
     * Saves the calendar mode to local storage.
     * @param {string} mode the current calendar view mode
     */
    saveMode(mode) {
      localStorage.setItem("calendarMode", mode);
    },
    /**
     * Sets the calendar dates that will be displayed to the user based on the current view setting
     * and the date specified in the URL path.
     * @param {Route} route the current route object
     */
    async setCalendar(route) {
      console.log("#7:\t", new Date-abcd);
      if (this.$route.name == "month" && this.mode != "month")
        this.saveMode(this.mode = "month");
      else if (this.$route.name == "day" && !["day", "week"].includes(this.mode))
        this.saveMode(this.mode = "week");
      let year = +route.params.year, month = +route.params.month, day = +route.params.day;
      if (!this.calendar.keepCurrentDate)
        if (year && month) {
          this.calendar.currentDate = new Date(Date.UTC(year, month-1, day || 1));
          if (!day && this.calendar.currentDate.getUTCDay() == 0)
            this.calendar.currentDate = new Date(+this.calendar.currentDate+this.$MS_PER_DAY);
          else if (!day && this.calendar.currentDate.getUTCDay() == 6)
            this.calendar.currentDate = new Date(+this.calendar.currentDate+2*this.$MS_PER_DAY);
        } else this.calendar.currentDate = this.getCurrentUTCMidnight();
      else this.calendar.keepCurrentDate = false;
      this.calendar.currentMonth = null;
      /** @type {Date} */
      let startDate, endDate;
      if (this.mode == "month") {
        let firstDay, lastDay;
        if (route.name == "month") {
          this.calendar.currentMonth = month-1;
          firstDay = new Date(Date.UTC(year, month-1));
          lastDay = new Date(Date.UTC(year, month, 0));
        } else {
          let date = new Date(+this.calendar.currentDate);
          this.calendar.currentMonth = date.getUTCMonth();
          lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, 0));
          firstDay = new Date(date.setUTCDate(1));
        }
        if (firstDay.getUTCDay() == 6) startDate = new Date(+firstDay+this.$MS_PER_DAY);
        else startDate = this.getSunday(firstDay); // first week of month
        if (lastDay.getUTCDay() == 0) endDate = new Date(lastDay-this.$MS_PER_DAY);
        else endDate = new Date(+this.getSunday(lastDay)+5*this.$MS_PER_DAY);
        // ^ need to add 5 days to the previous sunday to get friday of the last week of the month
      } else if (this.mode == "week") {
        if (route.name == "day")
          startDate = this.getSunday(new Date(Date.UTC(year, month-1, day))); // date in URL
        else
          startDate = this.getSunday(new Date(+this.calendar.currentDate)); // sunday of the current week
        endDate = new Date(+startDate+5*this.$MS_PER_DAY); // add 5 days to get friday
      } else if (route.name == "day") // is day mode
        startDate = endDate = new Date(Date.UTC(year, month-1, day)); // date specified in URL
      else // if no date specified in URL path
        startDate = endDate = new Date(+this.calendar.currentDate);
      let dates = [];
      while (startDate <= endDate) {
        if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
          dates.push(startDate);
        startDate = new Date(+startDate+this.$MS_PER_DAY); // add 1 day
      }
      this.calendar.dates = dates;
      this.changeTitle();
      console.log("#8:\t", new Date-abcd);
      let schedules = [];
      if (!this.features.indexedDB) return;
      await Promise.all(dates.map(async date => {
        let schedule = await this.db.get("schedules", date);
        if (schedule) schedules.push(schedule);
      }));
      this.schedules = schedules;
      console.log("#9:\t", new Date-abcd);
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
};
</script>

<style>
.v-application .font-family.pt-sans {
  font-family: "PT Sans", sans-serif !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media print {
  @page {
    size: landscape;
  }
}
</style>
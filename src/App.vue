<template>
  <v-app v-if="calendar.dates.length != 0">
    <v-app-bar app elevate-on-scroll>
      <v-spacer></v-spacer>
      <v-btn class="hidden-print-only" icon @click="nextOrPrevious(false)">
        <v-icon>chevron_left</v-icon>
      </v-btn>
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
        <v-date-picker v-model="currentDateString" :allowed-dates="allowedDate" color="accent" :type="mode == 'month' ? 'month' : 'date'" @input="datePicker = false">
          
        </v-date-picker>
      </v-menu>
      <v-btn class="hidden-print-only mr-2" icon @click="nextOrPrevious(true)">
        <v-icon>chevron_right</v-icon>
      </v-btn>
      <transition name="fade" mode="out-in">
        <v-toolbar-title v-if="calendar.titleChanging" key="changing" class="title font-family gilroy font-weight-medium text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '215px' : '144px'}">
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
        <v-toolbar-title v-else key="title" class="headline font-family gilroy font-weight-medium text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '215px' : '144px', cursor: 'pointer'}" @click="changeTitle">
          <span v-if="$vuetify.breakpoint.smAndUp">Harker </span>Bell Schedule
        </v-toolbar-title>
      </transition>
      <v-menu offset-y>
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only ml-2" icon v-on="{...menu}">
            <v-icon>settings</v-icon>
          </v-btn>
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
            <v-list-item-icon style="margin-top: 10px; margin-bottom: 10px;">
              <v-icon>print</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Print</v-list-item-title>
              <v-list-item-subtitle v-if="$vuetify.theme.dark">Light theme recommended</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content style="overflow-x: scroll;">
      <div id="message-wrapper" style="height: 16px;">
        <div id="message" class="caption text-center hidden-print-only" v-html="message"></div>
      </div>
      <div class="text-center hidden-screen-only">
        <span v-if="mode == 'month'">{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCFullYear()}}</span>
        <span v-else-if="mode == 'week'">{{shortMonths[calendar.dates[0].getUTCMonth()]}} {{calendar.dates[0].getUTCDate()}} &ndash; {{shortMonths[calendar.dates[calendar.dates.length-1].getUTCMonth()]}} {{calendar.dates[calendar.dates.length-1].getUTCDate()}}, {{calendar.dates[calendar.dates.length-1].getUTCFullYear()}}</span>
        <span v-else>{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCDate()}}, {{calendar.currentDate.getUTCFullYear()}}</span>
      </div>
      <router-view :calendar="calendar" :mode="mode" :raw-schedules="rawSchedules" :schedules="schedules" :sheet-id="menu.open ? menu.sheetId : null" @show-menu="showMenu"></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" eager :fullscreen="$vuetify.breakpoint.xsOnly" :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'" width="480" @input="closeSettings">
      <v-card>
        <v-app-bar elevate-on-scroll>
          <v-btn icon @click="closeSettings">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="font-family gilroy font-weight-medium">Settings</v-toolbar-title>
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
    <v-footer class="hidden-print-only" app color="primary" elevation="2" fixed padless>
      <div class="caption mx-2">
        <span>Last connected </span>
        <span :class="{'success--text': io.connected}">{{io.connected ? "just now" : formattedLastConnected || "never"}}</span>
      </div>
      <v-spacer></v-spacer>
      <div class="caption mx-2">
        <span>Last updated </span>
        <span>{{formattedLastUpdated || "never"}}</span>
      </div>
    </v-footer>
    <v-snackbar v-model="snackbars.pwaUpdated" :timeout="0">
      A new version is available! Reload the page to update.
      <v-btn text @click="refreshPwa">Reload</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import io from "socket.io-client";
var abcd = new Date;
export default {
  name: "App",
  data() {
    return {
      env: process.env,
      socket: null,
      io: {
        connected: false,
        lastConnected: localStorage.getItem("lastConnected") || null,
        lastUpdated: localStorage.getItem("lastUpdated") || null,
      },
      db: window.db,
      mode: localStorage.getItem("calendarMode") || "week",
      rawSchedules: [],
      calendar: {
        currentDate: this.getCurrentUTCMidnight(), // TODO: this or null?
        currentMonth: null,
        dates: [],
        keepCurrentDate: false,
        titleChanging: false,
        titleTimeout: null,
        loading: false,
      },
      message: "",
      menu: {
        open: false,
        openTracker: 0,
        sheetId: null,
        x: 0,
        y: 0,
      },
      datePicker: false,
      arrowAllowed: true,
      settings: {
        dialog: this.$route.name == "settings",
      },
      snackbars: {
        offlineReady: true,
        pwaUpdated: false,
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
    },
    formattedLastConnected() {
      return this.formatDate(this.io.lastConnected);
    },
    formattedLastUpdated() {
      return this.formatDate(this.io.lastUpdated);
    },
    /** Converts the raw schedule array into an object. */
    schedules() {
      let obj = {};
      for (const schedule of this.rawSchedules) obj[schedule.date] = schedule;
      return obj;
    },
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
  async created() {
    console.log(new Date-abcd);
    console.log(new Date-abcd);
    /** Number of milliseconds in a day */
    this.$MS_PER_DAY = 24*60*60*1000;
    if (localStorage.getItem("darkTheme") == "true") {
      this.$vuetify.theme.dark = true;
      document.querySelector('meta[name="theme-color"]').setAttribute("content",  "#202124");
    }
    window.addEventListener("pwaUpdated", () => {
      this.snackbars.pwaUpdated = true;
    });
    console.log("STARTING:\t", new Date-abcd);
    await this.setCalendar(this.$route);
    this.socket = io("https://bell.dev.harker.org", {timeout: 10000});
    this.socket.on("connect", () => {
      console.log("SOCK CONN:\t", new Date-abcd);
      this.io.connected = true;
      if (this.db) this.socket.emit("request update", localStorage.getItem("scheduleRevision"));
    });
    this.socket.on("disconnect", reason => {
      this.io.connected = false;
      console.log(reason);
    });
    this.socket.on("update message", message => {
      this.message = message;
      this.lastUpdated = new Date();
      this.$nextTick(() => {
        document.getElementById("message-wrapper").style.height = document.getElementById("message").clientHeight+"px";
      });
    });
    if (this.db) this.socket.on("update schedule", async (schedules, revision) => {
      if (revision) {
        for (const schedule of schedules)
          await this.db.put("schedules", schedule);
        localStorage.setItem("scheduleRevision", revision);
        localStorage.setItem("lastUpdated", new Date().getTime());
        await this.setCalendar(this.$route);
      }
    });
    this.socket.on("pong", () => {
      let now = new Date();
      this.lastConnected = now;
      localStorage.setItem("lastConnected", now.getTime());
    });
    if (this.rawSchedules.length == 0) this.getFromSocket(this.calendar.dates);
    window.addEventListener("keyup", event => {
      if (event.key == "ArrowRight" || event.keyCode == 39) this.nextOrPrevious(true);
      else if (event.key == "ArrowLeft" || event.keyCode == 37) this.nextOrPrevious(false);
    });
    console.log("INIT DONE:\t", new Date-abcd);
  },
  beforeMount() {
    console.log("beforeMount", new Date-abcd);
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
      if (this.calendar.titleTimeout) {
        this.calendar.titleChanging = true;
        clearTimeout(this.calendar.titleTimeout);
        this.calendar.titleTimeout = setTimeout(() => {this.calendar.titleChanging = false;}, 2000);
      } else this.calendar.titleTimeout = true;
    },
    /** Closes the settings dialog by either navigating back in history or going to the home page. */
    closeSettings() {
      if (this.prevRoute) this.$router.back();
      else this.$router.push("/");
    },
    /**
     * 
     * @param {Date} date date to be formatted
     */
    formatDate(timestamp) {
      if (!timestamp) return null;
      let date = new Date(+timestamp);
      if (new Date().setHours(0, 0, 0, 0) == new Date(+timestamp).setHours(0, 0, 0, 0))
        return date.toLocaleTimeString(undefined, {timeStyle: "short", hour: "numeric", minute: "2-digit"});
      return date.toLocaleDateString(undefined, {dateStyle: "short", timeStyle: "short", month: "numeric", day: "numeric", year: "2-digit", hour: "numeric", minute: "2-digit"});
    },
    /**
     * 
     * @param {Date[]} dates array of
     * @return {Object[]}      array of schedules retrieved from IndexedDB, or an empty array if not available
     */
    async getFromIndexedDB(dates) {
      let schedules = [];
      console.log("GET IDB:\t", new Date-abcd);
      if (this.db) {
        await Promise.all(dates.map(async date => {
          console.log("GETTING:\t", new Date-abcd);
          let schedule = await this.db.get("schedules", date.toISOString());
          if (schedule) schedules.push(schedule);
          console.log("GOTTEN:\t", new Date-abcd);
        }));
      }
      console.log("GOT IDB:\t", new Date-abcd);
      return schedules;
    },
    /**
     * 
     * @param {Date[]} dates array of
     */
    getFromSocket(dates) {
      console.log("getFromSocket");
      this.calendar.loading = true;
      this.socket.emit("request schedule", {
        start: dates[0],
        end: dates[dates.length-1]
      }, schedules => {
        console.log("GOT SOCK:\t", new Date-abcd);
        this.rawSchedules = schedules;
        this.calendar.loading = false;
        console.log(this.db);
      });
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
      if (!this.arrowAllowed) return;
      this.arrowAllowed = false;
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
      this.arrowAllowed = true;
    },
    /** Prints the current view of the bell schedule. */
    print() {
      setTimeout(() => {
        window.print();
      }, 100);
    },
    /** Reloads the page when the user clicks on the PWA update snackbar. */
    refreshPwa() {
      this.snackbars.pwaUpdated = false;
      window.location.reload(false);
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
      console.log("SETCALENDAR: ", route);
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
      if (this.db) this.rawSchedules = await this.getFromIndexedDB(dates);
      else if (this.socket) this.getFromSocket(dates);
      this.calendar.dates = dates;
      this.changeTitle();
      console.log("SET CAL:\t", new Date-abcd);
    },
    /**
     * Opens the panel displaying the lunch menu next to the appropriate date when the show-menu event is emitted.
     * @param {string} id ID of the lunch period element
     * @param {Date} date date of the lunch menu being shown
     */
    showMenu(id, date) {
      console.log(date);
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
.v-application .font-family.gilroy {
  font-family: Gilroy, Roboto, sans-serif !important;
}
.v-snack__wrapper {
  border-radius: 3px !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
#message {
  position: fixed;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  line-height: normal;
}
@media print {
  @page {
    size: landscape;
  }
}
</style>
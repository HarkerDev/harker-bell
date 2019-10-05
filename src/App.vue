<template>
  <v-app v-if="calendar.dates.length != 0">
    <v-app-bar app elevate-on-scroll style="overflow-x: auto;">
      <v-spacer></v-spacer>
      <v-btn class="hidden-print-only" icon ga-on="click" ga-event-category="Previous" ga-event-action="click" @click="nextOrPrevious(false)">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <!-- TODO: Figure out why offset-y stopped working after commit 6161b44 (8/19) -->
      <v-menu v-model="datePicker" :close-on-content-click="false" nudge-bottom="24">
        <template v-slot:activator="{on: menu}">
          <v-tooltip key="datePicker" bottom open-delay="500" transition="scale-transition" origin="top center">
            <template v-slot:activator="{on: tooltip}">
              <v-btn class="hidden-print-only" icon ga-on="click, contextmenu" ga-event-category="Date Picker Icon" ga-event-action="click" v-on="{...tooltip, ...menu}">
                <v-icon>date_range</v-icon>
              </v-btn>
            </template>
            <span>Select a date</span>
          </v-tooltip>
        </template>
        <v-date-picker v-model="currentDateString" :allowed-dates="allowedDate" color="accent" :type="mode == 'month' ? 'month' : 'date'" @input="datePicker = false"></v-date-picker>
      </v-menu>
      <v-btn class="hidden-print-only mr-2" icon ga-on="click" ga-event-category="Next" ga-event-action="click" @click="nextOrPrevious(true)">
        <v-icon>chevron_right</v-icon>
      </v-btn>
      <transition name="fade" mode="out-in">
        <v-toolbar-title v-if="calendar.titleChanging" key="changing" class="title font-weight-medium text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '220px' : '145px'}">
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
        <v-toolbar-title v-else key="title" class="headline font-weight-medium text-center" :style="{'min-width': $vuetify.breakpoint.smAndUp ? '220px' : '145px', cursor: 'pointer'}" ga-on="click" ga-event-category="Title" ga-event-action="click" @click="changeTitle">
          <span v-if="$vuetify.breakpoint.smAndUp">Harker </span>Bell Schedule
        </v-toolbar-title>
      </transition>
      <v-menu offset-y min-width="160">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only ml-2" icon ga-on="click, contextmenu" ga-event-category="Settings Icon" ga-event-action="click" v-on="{...menu}">
            <v-icon>settings</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$router.push('/settings')">
            <v-list-item-icon class="list-item-icon">
              <v-icon>tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="https://bell.harker.org/docs/shortcuts" target="_blank">
            <v-list-item-icon class="list-item-icon">
              <v-icon>keyboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Keyboard shortcuts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="https://bell.harker.org/submitevent" target="_blank">
            <v-list-item-icon class="list-item-icon">
              <v-icon>open_in_new</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Submit an event</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense subheader>
          <v-subheader>Change view</v-subheader>
          <v-list-item ga-on="click" ga-event-category="Day" ga-event-action="click" @click="changeMode('day')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'day'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="Week" ga-event-action="click" @click="changeMode('week')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'week'">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="Month" ga-event-action="click" @click="changeMode('month')">
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
          <v-list-item ga-on="click" ga-event-category="Print" ga-event-action="click" @click="print">
            <v-list-item-icon class="list-item-icon">
              <v-icon>print</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Print</v-list-item-title>
              <v-list-item-subtitle v-if="$vuetify.theme.dark">Light theme recommended</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content style="overflow-x: scroll;">
      <div id="message-wrapper" class="mb-2" style="height: 16px;">
        <div id="message" class="caption text-center hidden-print-only" v-html="message"></div>
      </div>
      <div class="text-center hidden-screen-only">
        <span v-if="mode == 'month'">{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCFullYear()}}</span>
        <span v-else-if="mode == 'week'">{{shortMonths[calendar.dates[0].getUTCMonth()]}} {{calendar.dates[0].getUTCDate()}} &ndash; {{shortMonths[calendar.dates[calendar.dates.length-1].getUTCMonth()]}} {{calendar.dates[calendar.dates.length-1].getUTCDate()}}, {{calendar.dates[calendar.dates.length-1].getUTCFullYear()}}</span>
        <span v-else>{{longMonths[calendar.currentDate.getUTCMonth()]}} {{calendar.currentDate.getUTCDate()}}, {{calendar.currentDate.getUTCFullYear()}}</span>
      </div>
      <router-view :calendar="calendar" :mode="mode" :raw-schedules="rawSchedules" :schedules="schedules" :settings="settings" :sheet-id="menu.open ? menu.sheetId : null" :time="time" @show-menu="showMenu"></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" :fullscreen="$vuetify.breakpoint.xsOnly" :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'" width="420" @input="closeSettings">
      <v-card>
        <v-app-bar elevate-on-scroll>
          <v-btn icon @click="closeSettings">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-medium">Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="overline">Version {{env.VUE_APP_VERSION}}</div>
        </v-app-bar>
        <v-list subheader>
          <v-list-item>
            <v-list-item-content>Use dark theme</v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="$vuetify.theme.dark" :inset="features.ios"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>Show period colors</v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="settings.showColors" :inset="features.ios"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-text>
          <v-row>
            <v-col>
              <color-setting v-for="i in 4" :key="i" :num="i" :settings="settings"></color-setting>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <color-setting v-for="i in 3" :key="i+4" :num="i+4" :settings="settings"></color-setting>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center>
            <!--<a href="https://www.netlify.com" target="_blank">
              <v-img height="51" :src="require('./assets/'+($vuetify.theme.dark?'netlify-dark.svg':'netlify-light.svg'))"></v-img>
            </a>-->
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu v-model="menu.open" absolute :close-on-content-click="false" offset-x :position-x="menu.x" :position-y="menu.y">
      <v-card min-height="100" max-width="480">
        <v-simple-table v-if="schedules[menu.date.toISOString()] && schedules[menu.date.toISOString()].lunch.length > 0" dense fixed-header height="250">
          <thead>
            <tr>
              <th class="px-5">Location</th>
              <th class="px-5">Menu Item</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in schedules[menu.date.toISOString()].lunch" :key="item.place">
              <td class="body-2 font-weight-medium px-5" style="word-break: normal;">{{item.place}}</td>
              <td class="body-2 short py-2 px-5" style="white-space: pre-wrap;">{{item.food}}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-text v-else>No lunch menu available<br>for this day.</v-card-text>
      </v-card>
    </v-menu>
    <v-footer class="hidden-print-only" app color="primary" elevation="2" fixed padless>
      <div class="caption no-select mx-2">
        <span>Last connected </span>
        <span :class="{'success--text': io.connected}">{{io.connected ? "just now" : formattedLastConnected || "never"}}</span>
      </div>
      <v-spacer></v-spacer>
      <div class="caption no-select mx-2">
        <span>Last updated </span>
        <span>{{formattedLastUpdated || "never"}}</span>
      </div>
    </v-footer>
    <v-snackbar v-model="snackbars.pwaUpdated" :timeout="0">
      A new version is available! Refresh the page to update.
      <v-btn text @click="refreshPWA">Reload</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import ColorSetting from "./components/ColorSetting";
import { setInterval } from 'timers';
var abcd = new Date;
export default {
  name: "App",
  components: {
    ColorSetting
  },
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
        currentDate: null,
        currentMonth: null,
        dates: [],
        keepCurrentDate: false,
        titleChanging: false,
        titleTimeout: null,
        loading: false,
      },
      message: "",
      datePicker: false,
      arrowAllowed: true,
      menu: {
        open: false,
        openTracker: 0,
        date: new Date(),
        sheetId: null,
        x: 0,
        y: 0,
      },
      settings: {
        dialog: this.$route.name == "settings",
        showColors: localStorage.getItem("showPeriodColors") || false,
        periodColors: JSON.parse(localStorage.getItem("periodColors")) || ["blue2", "red2", "green2", "yellow2", "orange2", "teal2", "purple2"],
        colors: ["red2", "deeporange2", "orange2", "yellow2", "lightgreen2", "green2", "teal2", "lightblue2", "blue2", "indigo2", "purple2", "pink2", "bluegrey2", "grey2"],
      },
      time: {
        now: new Date(),
        utcNow: new Date(new Date()-new Date().getTimezoneOffset()*60000),
        today: null,
      },
      snackbars: {
        offlineReady: true,
        pwaUpdated: false,
      },
      prevRoute: null,
      features: {
        indexedDB: window.indexedDB ? true : false,
        ios: window.navigator.platform.toLowerCase().includes("ios") ||
             window.navigator.platform.toLowerCase().includes("iphone") ||
             window.navigator.platform.toLowerCase().includes("ipad"),
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
      return this.formatDate(this.io.lastConnected, true);
    },
    formattedLastUpdated() {
      return this.formatDate(this.io.lastUpdated, false);
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
      this.changeTitle();
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
      if (window.ga) window.ga("set", "dimension1", dark);
    },
    /** Handles changes to the period colors toggle setting. */
    "settings.showColors"(showColors) {
      localStorage.setItem("showPeriodColors", showColors);
      if (window.ga) window.ga("set", "dimension2", showColors);
    },
  },
  async created() {
    console.log(new Date-abcd);
    console.log(new Date-abcd);
    /** Number of milliseconds per minute and day */
    this.$MS_PER_MIN = 60*1000;
    this.$MS_PER_DAY = this.$MS_PER_MIN*60*24;
    if (localStorage.getItem("darkTheme") == "true") {
      this.$vuetify.theme.dark = true;
      document.querySelector('meta[name="theme-color"]').setAttribute("content",  "#202124");
    }
    window.addEventListener("pwaUpdated", () => {
      this.snackbars.pwaUpdated = true;
    });
    this.time.today = this.getCurrentUTCMidnight();
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
      this.$nextTick(() => {
        const el = document.getElementById("message-wrapper");
        if (el) el.style.height = document.getElementById("message").clientHeight+"px";
      });
    });
    if (this.db) this.socket.on("update schedule", async (schedules, revision) => {
      if (revision) {
        for (const schedule of schedules)
          await this.db.put("schedules", schedule);
        this.io.lastUpdated = new Date();
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
    if (!localStorage.getItem("scheduleRevision")) this.getFromSocket(this.calendar.dates);
    console.log("INIT DONE:\t", new Date-abcd);
  },
  mounted() {
    setInterval(this.updateTime(), this.$MS_PER_MIN);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.updateTime();
    });
    window.addEventListener("keyup", event => {
      if (event.key == "ArrowRight" || event.keyCode == 39) this.nextOrPrevious(true);
      else if (event.key == "ArrowLeft" || event.keyCode == 37) this.nextOrPrevious(false);
      else if (event.key == "ArrowDown" || event.keyCode == 40 ||
               event.key == "KeyT" || event.keyCode == 84) this.$router.push("/").catch(() => {});
      else if (event.key == "KeyD" || event.keyCode == 68) this.changeMode("day");
      else if (event.key == "KeyW" || event.keyCode == 87) this.changeMode("week");
      else if (event.key == "KeyD" || event.keyCode == 77) this.changeMode("month");
    });
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
     * Formats a date into a human-readable representation. Can optionally omit the time portion.
     * @param {Date} date         date to be formatted
     * @param {boolean} showTime  whether or not to include the time portion of the date
     * @return {string}           formatted date string, based on locale
     */
    formatDate(timestamp, showTime) {
      if (!timestamp) return null;
      let date = new Date(+timestamp);
      if (new Date().setHours(0, 0, 0, 0) == new Date(+timestamp).setHours(0, 0, 0, 0))
        return date.toLocaleTimeString(undefined, {timeStyle: "short", hour: "numeric", minute: "2-digit"});
      if (!showTime)
        return date.toLocaleDateString(undefined, {dateStyle: "short", month: "numeric", day: "numeric", year: "2-digit"});
      return date.toLocaleDateString(undefined, {dateStyle: "short", timeStyle: "short", month: "numeric", day: "numeric", year: "2-digit", hour: "numeric", minute: "2-digit"});
    },
    /**
     * Retrives local schedules from IndexedDB if available.
     * @param {Date[]} dates  array of dates
     * @return {Object[]}     array of schedules retrieved from IndexedDB, or an empty array if not available
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
     * Retrives remote schedules using the websocket.
     * @param {Date[]} dates  array of dates
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
      let date = new Date(now-now.getTimezoneOffset()*this.$MS_PER_MIN);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    /**
     * Calculates the date of the last sunday on or before a given date.
     * @param {Date} date the date to use for calculating sunday
     * @return {Date}     the latest sunday on or before date
     */
    getSunday(date) {
      date = new Date(date);
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
      else if (this.mode == "week") {
        date = this.getSunday(new Date(+date+sign*7*this.$MS_PER_DAY));
        date.setUTCDate(date.getUTCDate()+1);
      // if going next and it's a friday, then skip directly to monday, and vice versa
      } else if (isNext && date.getUTCDay() == 5 || !isNext && date.getUTCDay() == 1)
        date.setUTCDate(date.getUTCDate()+sign*3);
      else // day mode
        date.setUTCDate(date.getUTCDate()+sign*1);
      if (+date == +today || this.mode == "week" && +this.getSunday(date) == +this.getSunday(today) ||
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
    refreshPWA() {
      this.snackbars.pwaUpdated = false;
      window.location.reload(false);
    },
    /**
     * Saves the calendar mode to local storage.
     * @param {string} mode the current calendar view mode
     */
    saveMode(mode) {
      localStorage.setItem("calendarMode", mode);
      if (window.ga) window.ga("set", "dimension3", mode);
    },
    /**
     * Sets the calendar dates that will be displayed to the user based on the current view setting
     * and the date specified in the URL path.
     * @param {Route} route the current route object
     */
    async setCalendar(route) {
      console.log("SETCALENDAR: ", route);
      console.log("BEGINCAL:\t", new Date-abcd);
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
      if (this.mode == "day") {
        let date = this.calendar.currentDate;
        if (date.getUTCDay() == 0) date = new Date(+date+this.$MS_PER_DAY);
        else if (date.getUTCDay() == 6) date = new Date(date-this.$MS_PER_DAY);
        if (+date != +this.calendar.currentDate) {
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`);
          return;
        }
      }
      let dates = [];
      while (startDate <= endDate) {
        if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
          dates.push(startDate);
        startDate = new Date(+startDate+this.$MS_PER_DAY); // add 1 day
      }
      if (this.db) this.rawSchedules = await this.getFromIndexedDB(dates);
      else if (this.socket) this.getFromSocket(dates);
      this.calendar.dates = dates;
      console.log("SET CAL:\t", new Date-abcd);
    },
    /**
     * Opens the panel displaying the lunch menu next to the appropriate date when the show-menu event is emitted.
     * @param {string} id ID of the lunch period element
     * @param {Date} date date of the lunch menu being shown
     */
    showMenu(id, date) {
      this.menu.date = date;
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
    /**  */
    updateTime() {
      this.time.now = new Date();
      this.time.utcNow = new Date(this.time.now-this.time.now.getTimezoneOffset()*this.$MS_PER_MIN);
      this.time.today = this.getCurrentUTCMidnight();
    },
  },
};
</script>

<style>
.v-snack__wrapper {
  border-radius: 2px !important;
}
.v-date-picker-title__date {
  font-size: 26px !important;
}
.v-menu__content {
  max-width: 95% !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.short {
  line-height: 1.2 !important;
}
#message {
  position: fixed;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  line-height: normal;
}
.no-select {
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.v-list-item__icon:first-child {
  margin-right: 18px !important;
}
.list-item-icon {
  margin-top: 10px;
  margin-bottom: 8px;
}
.list-item-text {
  font-size: 15px;
}
.blink {
  animation: blink 1.25s step-start infinite;
}
@keyframes blink {
  50% {opacity: 0;}
}
@media print {
  @page {size: landscape;}
}
body {
  -webkit-print-color-adjust: exact !important;
}
</style>
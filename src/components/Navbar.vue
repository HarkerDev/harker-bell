<template>
    <v-app-bar app color="primary" elevate-on-scroll style="overflow-x: auto; opacity: 0.9;">
      <v-spacer></v-spacer>
      <v-btn class="hidden-print-only" icon aria-label="Previous" ga-on="click" ga-event-category="previous"
             ga-event-action="click" @click="nextOrPrevious(false)"
      >
        <!--        <v-icon class="material-icons-outlined">chevron_left</v-icon>-->
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
        </svg>
      </v-btn>
      <v-menu v-model="datePicker" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{on}">
          <v-btn class="hidden-print-only" icon aria-label="Choose a date" ga-on="click, contextmenu"
                 ga-event-category="date picker icon" ga-event-action="click" v-on="on"
          >
            <v-icon class="material-icons-outlined">event</v-icon>
          </v-btn>
        </template>
        <v-date-picker v-model="currentDateString" :allowed-dates="allowedDate" color="accent" type="date"
                       @input="datePicker = false"
        >
          <v-spacer></v-spacer>
          <v-btn color="accent" small outlined @click="$router.push('/').catch(() => {}); datePicker = false;">
            Today
          </v-btn>
          <v-spacer></v-spacer>
        </v-date-picker>
      </v-menu>
      <v-btn class="hidden-print-only mr-2" icon aria-label="Next" ga-on="click" ga-event-category="next"
             ga-event-action="click" @click="nextOrPrevious(true)"
      >
        <!--        <v-icon class="material-icons-outlined">chevron_right</v-icon>-->
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
        </svg>
      </v-btn>
      <transition name="fade" mode="out-in">
        <v-toolbar-title v-if="calendar.titleChanging" key="changing" class="title text-center"
                         :style="{minWidth: $vuetify.breakpoint.smAndUp ? '205px' : '65px'}"
        >
          <template v-if="$vuetify.breakpoint.smAndUp">
            <span v-if="mode == 'week'">{{ shortMonths[calendar.dates[0].getUTCMonth()] }} {{ calendar.dates[0].getUTCDate() }} &ndash; {{ shortMonths[calendar.dates[calendar.dates.length - 1].getUTCMonth()] }} {{ calendar.dates[calendar.dates.length - 1].getUTCDate() }}, {{ calendar.dates[calendar.dates.length - 1].getUTCFullYear() }}</span>
            <span v-else>{{ longMonths[calendar.currentDate.getUTCMonth()] }} {{ calendar.currentDate.getUTCDate() }}, {{ calendar.currentDate.getUTCFullYear() }}</span>
          </template>
          <template v-else>
            <span v-if="mode == 'week'">{{ shortMonths[calendar.dates[0].getUTCMonth()] }} {{ calendar.dates[0].getUTCDate() }} - {{ shortMonths[calendar.dates[calendar.dates.length - 1].getUTCMonth()] }} {{ calendar.dates[calendar.dates.length - 1].getUTCDate() }}</span>
            <span v-else>{{ shortMonths[calendar.currentDate.getUTCMonth()] }} {{ calendar.currentDate.getUTCDate() }}, {{ calendar.currentDate.getUTCFullYear() }}</span>
          </template>
        </v-toolbar-title>
        <v-toolbar-title v-else id="title" key="title" class="headline text-center"
                         :style="{minWidth: $vuetify.breakpoint.smAndUp ? '205px' : '65px'}" ga-on="click"
                         ga-event-category="title" ga-event-action="click" @click="changeTitle"
        >
          <span v-if="$vuetify.breakpoint.smAndUp">Harker </span>Bell <span v-if="$vuetify.breakpoint.smAndUp"> Schedule</span>
        </v-toolbar-title>
      </transition>
      <v-menu offset-y min-width="160">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only ml-2" icon aria-label="Settings" ga-on="click, contextmenu"
                 ga-event-category="settings icon" ga-event-action="click" v-on="{...menu}"
          >
            <v-icon class="material-icons-outlined">settings</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$router.push('/settings')">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item href="https://bell.harker.org/submitevent" target="_blank">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">open_in_new</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Submit an event</v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
        <v-divider></v-divider>
        <v-list dense subheader>
          <v-subheader>Change view</v-subheader>
          <v-list-item ga-on="click" ga-event-category="day" ga-event-action="click" @click="changeMode('day')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'day'" class="material-icons-outlined">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="week" ga-event-action="click" @click="changeMode('week')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'week'" class="material-icons-outlined">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-if="features.beforeInstallPrompt" color="accent" :input-value="true" ga-on="click"
                       ga-event-category="install" ga-event-action="click" @click="showInstallPrompt"
          >
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">get_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text font-weight-medium">Install app</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="print" ga-event-action="click" @click="print">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">print</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Print</v-list-item-title>
              <v-list-item-subtitle v-if="$vuetify.theme.dark">Light theme recommended</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y min-width="300" content-class="hdev-announcement">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="Announcements" ga-on="click, contextmenu"
                 ga-event-category="app menu" ga-event-action="click" v-on="{...menu}"
          >
            <v-icon color="#0ebf8f" size="30" class="material-icons-outlined">campaign</v-icon>
          </v-btn>
        </template>
<!--        <div style="height: max-content; min-height: 50px; background-color: var(&#45;&#45;v-accent-base); align-items: center; padding: 4px;">-->
          <v-card style="max-width: 300px; padding: 5px;">
            <p class="text-center heading pa-0">ASB Announcements</p>
            <v-divider></v-divider>
            <div id="announcement" class="caption text-center"
                 v-html="announcement" style="margin: 3px"
            ></div>
          </v-card>

<!--        </div>-->
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y min-width="300" content-class="hdev-app-menu">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="All apps" ga-on="click, contextmenu"
                 ga-event-category="app menu" ga-event-action="click" v-on="{...menu}"
          >
            <!--            <v-icon class="material-icons-outlined">apps</v-icon>-->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path fill="currentColor"
                    d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
              />
            </svg>
          </v-btn>
        </template>
        <iframe src="https://harkerdev-menu.netlify.app/?exclude=bell" style="border: none; height: 100%"></iframe>
      </v-menu>
      <p>test</p>
    </v-app-bar>

</template>

<script>
    export default {
        name: 'Navbar',
        data() {
            return {
                message: "",
                announcement: "",
                datePicker: false,
                calendar: {
                    currentDate: null,
                    currentMonth: null,
                    dates: [],
                    keepCurrentDate: false,
                    titleChanging: false,
                    titleTimeout: null,
                    loading: false,
                },
            }
        },
        watch: {
            /** Responds to route changes. */
            $route(route, prevRoute) {
                this.prevRoute = prevRoute;
                this.settings.dialog = route.name == "settings";
                if (["home", "day"].includes(route.name)) this.setCalendar(route);
                this.changeTitle();
            },
        },
        methods: {
                /**
                 * Determines if the date represented by a given ISO date is allowed in the date picker.
                 * @param {string} dateString date as an ISO date string (YYYY-MM-DD format)
                 * @return                    true if the date falls on a weekday; otherwise, false
                 */
                allowedDate(dateString) {
                let date = new Date(dateString);
                return date.getUTCDay() > 0 && date.getUTCDay() < 6;
                },
                /**
                 * Sets the calendar dates that will be displayed to the user based on the current view setting
                 * and the date specified in the URL path.
                 * @param {Route} route the current route object
                 */
                async setCalendar(route) {
                //console.log("SETCALENDAR: ", route);
                //console.log("BEGINCAL:\t", new Date-abcd);
                if (this.$route.name == "day" && !["day", "week"].includes(this.mode))
                    this.saveMode(this.mode = "week");
                let year = +route.params.year, month = +route.params.month, day = +route.params.day;
                if (!this.calendar.keepCurrentDate)
                    if (year && month) {
                    this.calendar.currentDate = new Date(Date.UTC(year, month - 1, day || 1));
                    if (!day && this.calendar.currentDate.getUTCDay() == 0)
                        this.calendar.currentDate = new Date(+this.calendar.currentDate + this.$MS_PER_DAY);
                    else if (!day && this.calendar.currentDate.getUTCDay() == 6)
                        this.calendar.currentDate = new Date(+this.calendar.currentDate + 2 * this.$MS_PER_DAY);
                    } else this.calendar.currentDate = this.getCurrentUTCMidnight();
                else this.calendar.keepCurrentDate = false;
                this.calendar.currentMonth = null;
                /** @type {Date} */
                let startDate, endDate;
                if (this.mode == "week") {
                    if (route.name == "day")
                    startDate = this.getSaturday(new Date(Date.UTC(year, month - 1, day))); // date in URL
                    else
                    startDate = this.getSaturday(new Date(+this.calendar.currentDate)); // saturday of the current week
                    endDate = new Date(+startDate + 6 * this.$MS_PER_DAY); // add 6 days to get friday
                } else if (route.name == "day") { // is day route
                    startDate = endDate = new Date(Date.UTC(year, month - 1, day)); // date specified in URL
                    let date = this.calendar.currentDate;
                    if (date.getUTCDay() == 0) date = new Date(+date + this.$MS_PER_DAY);
                    else if (date.getUTCDay() == 6) date = new Date(+date + 2 * this.$MS_PER_DAY);
                    if (+date != +this.calendar.currentDate) {
                    this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`);
                    return;
                    }
                } else { // if no date specified in URL path
                    startDate = endDate = this.calendar.currentDate;
                    if (startDate.getUTCDay() == 0) startDate = endDate = new Date(+startDate + this.$MS_PER_DAY);
                    else if (startDate.getUTCDay() == 6) startDate = endDate = new Date(+startDate + 2 * this.$MS_PER_DAY);
                    this.calendar.currentDate = startDate;
                }
                let dates = [];
                while (startDate <= endDate) {
                    if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
                    dates.push(startDate);
                    startDate = new Date(+startDate + this.$MS_PER_DAY); // add 1 day
                }
                if (this.db) this.rawSchedules = await this.getFromIndexedDB(dates);
                else if (this.socket) this.getFromSocket(dates);
                this.calendar.dates = dates;
                //console.log("SET CAL:\t", new Date-abcd);
                },
        },
        computed: {
            currentDateString: {
            /** Returns the current date as an ISO string for date picker purposes. */
            get() {
                let date = this.calendar.currentDate.toISOString()
                return date.substring(0, 10);
            },
            /**
             * When set, the underlying date variable is also updated to reflect the changes.
             * @param {string} value  date string in ISO format
             */
            set(value) {
                let date = new Date(value), today = this.getCurrentUTCMidnight();
                if (+date == +today)
                this.$router.push("/");
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
    }

    
</script>

<style lang="scss" scoped>

</style>
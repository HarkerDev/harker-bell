<template>
  <v-container fluid :style="{'min-width': mode == 'week' ? '932px' : 'unset'}">
    <transition-group name="schedule-transition">
      <!-- MONTH HEADER -->
      <v-layout v-if="mode == 'month'" key="header" class="overline" justify-center>
        <v-sheet v-for="day in weekdays" :key="day" class="text-center" height="24" width="143">{{day}}</v-sheet>
      </v-layout>
      <v-layout v-for="(n, i) in Math.ceil(calendar.dates.length/5)" :key="calendar.dates[i*5].getTime()" justify-center>
        <!-- DAY CONTAINER -->
        <v-sheet v-for="(date, j) in calendar.dates.slice(5*i, 5*i+5)" :key="date.getTime()" ref="day" :class="['day-container', {'overflow-hidden': mode == 'month'}]" :width="mode == 'month' ? 144 : 180" :max-width="mode == 'month' ? 144 : 240" :min-height="mode == 'month' ? 84 : 515">
          <!-- DAY HEADER -->
          <v-sheet :class="['day-header', {month: mode == 'month'}]" :height="mode == 'month' ? 36 : 48" tile>
            <v-layout align-center>
              <v-flex xs3>
                <v-layout column align-center>
                  <span v-if="mode != 'month' && date.getUTCDate() != 1" class="overline">{{weekdays[date.getUTCDay()-1]}}</span>
                  <span v-else-if="date.getUTCDate() == 1" :class="['overline', {'mb-n2': mode == 'month'}]">{{months[date.getUTCMonth()]}}</span>
                  <span :class="[mode == 'month' ? 'title' : 'headline', 'short', 'font-family', 'pt-sans', !calendar.currentMonth || calendar.currentMonth == date.getUTCMonth() ? 'text--secondary' : 'text--disabled', 'font-weight-bold', 'font-transition']">{{date.getUTCDate()}}</span>
                </v-layout>
              </v-flex>
              <v-flex xs8>
                <v-layout wrap justify-end align-center>
                  <span class="overline normal text--secondary text-xs-right font-transition" :style="{'letter-spacing': mode == 'month' ? 'normal !important' : ''}">Adj.</span>
                  <span :class="[mode == 'month' ? 'title' : 'display-1', 'ml-1', 'font-family', 'pt-sans', 'text--disabled', 'font-weight-bold', 'font-transition']">B</span>
                </v-layout>
              </v-flex>
              <v-flex xs1></v-flex>
            </v-layout>
          </v-sheet>
          <!-- MONTH DAY CONTENT -->
          <div v-if="mode == 'month'" class="body-2">
            Events
          </div>
          <content-loader v-else-if="calendar.loading" :height="515" :width="180" :speed="0.6" secondary-color="#F1F3F4">
            <rect x="75" y="25" rx="2" ry="2" width="30" height="12"></rect>
            <rect x="50" y="45" rx="2" ry="2" width="80" height="12"></rect>
            <rect x="0" y="85" rx="0" ry="0" width="180" height="10"></rect>
            <rect x="75" y="120" rx="2" ry="2" width="30" height="12"></rect>
            <rect x="50" y="140" rx="2" ry="2" width="80" height="12"></rect>
            <rect x="0" y="180" rx="0" ry="0" width="180" height="10"></rect>
            <rect x="20" y="200" rx="2" ry="2" width="50" height="12"></rect>
            <rect x="10" y="215" rx="2" ry="2" width="70" height="12"></rect>
            <rect x="110" y="195" rx="2" ry="2" width="50" height="12"></rect>
            <rect x="100" y="212" rx="2" ry="2" width="70" height="15"></rect>
            <rect x="0" y="235" rx="0" ry="0" width="180" height="7"></rect>
            <rect x="75" y="270" rx="2" ry="2" width="30" height="12"></rect>
            <rect x="50" y="290" rx="2" ry="2" width="80" height="12"></rect>
          </content-loader>
          <!-- WEEK DAY CONTENT -->
          <template v-else>
            <v-layout v-for="(group, gIndex) in computedSchedules[date.toISOString()]" :key="gIndex" class="group">
              <v-flex v-for="(column, cIndex) in group" :key="cIndex" class="column">
                <template v-for="(period, pIndex) in column">
                  <!-- LUNCH PERIOD -->
                  <v-hover v-if="period.name && period.name.toLowerCase().indexOf('lunch') != -1" :key="pIndex" v-slot:default="{hover}">
                    <!-- TODO: Find a way to extract id logic somewhere -->
                    <v-sheet :id="j+'-'+gIndex+'-'+cIndex+'-'+pIndex" class="period lunch caption text-xs-center d-flex" :elevation="(sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex) ? 4 : (hover ? 2 : 0)" :height="period.duration+1" tile :style="{'z-index': (sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex || hover) ? 2 : 1}" @click.stop="showMenu(j+'-'+gIndex+'-'+cIndex+'-'+pIndex)">
                      <v-layout :class="{content: true, short: period.duration <= 50}" column align-center justify-center>
                        <div ref="periodNames">{{period.name}}</div>
                        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                        <div v-if="period.start && period.duration >= 30">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
                      </v-layout>
                    </v-sheet>
                  </v-hover>
                  <!-- REGULAR PERIOD -->
                  <v-sheet v-else :key="pIndex" class="period caption text-xs-center d-flex" :height="period.duration+1" tile>
                    <v-layout :class="{content: true, short: period.duration <= 50}" column align-center justify-center>
                      <div ref="periodNames">{{period.name}}</div>
                      <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                      <div v-if="period.start && period.duration >= 30">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
                    </v-layout>
                  </v-sheet>
                </template>
              </v-flex>
            </v-layout>
          </template>
        </v-sheet>
      </v-layout>
    </transition-group>
  </v-container>
</template>

<script>
import {ContentLoader} from "vue-content-loader";
export default {
  components: {
    ContentLoader,
  },
  filters: {
    /**
     * Returns a human-readable time from a Date object in H:MM format.
     * @return {String} 12-hour time without AM/PM
     */
    formatTime(date) {
      return (date.getUTCHours()+11)%12+1+":"+ // convert hours to 12-hour time
             ("0"+date.getUTCMinutes()).slice(-2); // pad minutes with a 0 if necessary
    }
  },
  props: {
    calendar: {
      type: Object,
      required: true
    },
    mode: {
      validator(value) {
        return ["day", "week", "month"].indexOf(value) != -1;
      },
      required: true
    },
    schedules: {
      type: Array,
      required: true
    },
    sheetId: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      displayMonthContent: this.mode == "month",
      open: false,
      ref: undefined,
      stayOpen: true,
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };
  },
  computed: {
    /**
     * Processes the raw schedule array prop and constructs a new object with arrays in the following format:
     * 1st dimension: list of period groups in a day. Period groups are separated by full-width horizontal
     *                lines when displayed in week or day view.
     * 2nd dimension: column groups for each period group. Column groups are used to split schedules when
     *                there are concurrent periods and are indicated by vertical lines on the page.
     * 3rd dimension: list of periods in the group, including passing periods.
     * @return {Object} object with dates as keys and 3-dimensional arrays as values
     */
    computedSchedules() {
      let computedSchedules = {};
      this.schedules.forEach(entry => {
        let schedule = entry.schedule;
        schedule[0].start = new Date(schedule[0].start);
        schedule[0].end = new Date(schedule[0].end);
        let result = [[[{ // create result array with first period (including its duration) as first element
          ...schedule[0],
          ...{duration: (schedule[0].end-schedule[0].start)/this.$MS_PER_MIN}}
        ]]];
        let latestEnd = schedule[0].end; // latest ending time in the current top-level period group (which can have multiple columns)
        for (let i = 1; i < schedule.length; i++) {
          let lastGroup = result[result.length-1]; // last group of periods in the schedule array being built
          let period = schedule[i], prevPeriod = schedule[i-1];
          period.start = new Date(period.start);
          period.end = new Date(period.end);
          period.duration = (period.end-period.start)/this.$MS_PER_MIN;
          if (+period.start == +prevPeriod.start) // add column if two periods start at the same time (dates are coerced to numbers)
            lastGroup.push([period]);
          else if (period.start < prevPeriod.end) // insert placeholder in new column if period starts before previous one ends
            lastGroup.push([
              {duration: (period.start-prevPeriod.end)/this.$MS_PER_MIN}, // duration of placeholder period
              period
            ]);
          else if (+period.start == +prevPeriod.end && period.start < latestEnd) // simply add to current column if periods are adjacent
            lastGroup[lastGroup.length-1].push(period);
          else if (+period.start == +prevPeriod.end) // start a new period group if period starts after the previous group
            result.push([[period]]);
          else if (period.start < latestEnd) // insert placeholder in current column if there's a gap between two periods
            lastGroup[lastGroup.length-1].push([[{duration: (period.start-prevPeriod.end)/this.$MS_PER_MIN}]], [[period]]);
          else // insert placeholder in a new period group otherwise
            result.push([[{duration: (period.start-latestEnd)/this.$MS_PER_MIN}]], [[period]]);
          latestEnd = Math.max(latestEnd, period.end);
        }
        computedSchedules[entry.date] = result;
      });
      return computedSchedules;
    },
    /** Keeps track of whether the current calendar mode is set to month view. */
    isMonth() {
      return this.mode == "month";
    },
  },
  watch: {
    /** Responds to calendar mode changes. */
    mode(value) {
      if (value == "month") {
        this.ref = this.$refs.day[0].$el;
        this.ref.addEventListener("transitionend", this.transitionEnd);
      } else
        this.displayMonthContent = false;
    },
  },
  created() {
    /** Number of milliseconds in a minute */
    this.$MS_PER_MIN = 60*1000;
  },
  methods: {
    /**
     * Shows the lunch menu for the lunch period element at the provided ID
     * @param {string} id ID of the lunch period element
     */
    showMenu(id) {
      this.$emit('show-menu', id);
      this.open = this.stayOpen = true;
    },
    /** TODO: DOCUMENT THIS */
    transitionEnd() {
      this.ref.removeEventListener("transitionend", this.transitionEnd);
      this.displayMonthContent = true;
      //this.$root.setCalendar(this.$route);
    },
  }
};
</script>

<style scoped>
.schedule-transition-move {
  /*-webkit-transition: -webkit-transform 300ms;
          transition: transform 300ms;*/
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
.schedule-transition-move .day-container {
  overflow: hidden;
}
.day-container {
  border: 1px solid var(--v-secondary-base);
  margin: 0 -1px -1px 0;
  /*-webkit-transition: width 300ms, max-width 300ms, max-height 300ms;
          transition: width 300ms, max-width 300ms, max-height 300ms;*/
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
.day-header:not(.month) {
  border-bottom: 1px solid var(--v-secondary-base);
  margin-bottom: -1px;
}
.column:not(:first-child) > .period {
  margin-left: 0;
}
.content {
  padding: 0 2px 2px;
  overflow-y: hidden;
}
.short {
  line-height: 1.2;
}
.normal {
  line-height: normal;
}
.period {
  border: 1px solid var(--v-secondary-base) !important;
  margin: 0 -1px -1px;
}
.lunch {
  cursor: pointer;
}
.font-transition {
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
</style>
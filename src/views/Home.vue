<template>
  <v-container fluid :class="{month: mode == 'month', week: mode == 'week', day: mode == 'day'}">
    <!-- MONTH HEADER -->
    <v-row v-if="mode == 'month'" key="header" class="overline flex-nowrap" justify="center">
      <v-sheet v-for="day in weekdays" :key="day" class="text-center" height="24" width="143">{{day}}</v-sheet>
    </v-row>
    <v-row key="content" class="row-container" justify="center" no-gutters>
      <v-col v-for="(date, j) in calendar.dates" :key="date.getTime()" class="cols-5" cols="4">
        <!-- DAY CONTAINER -->
        <v-sheet ref="day" :class="['day-container', 'border-thick', {'overflow-hidden': mode == 'month'}]" :max-width="mode == 'month' ? 144 : 180" :min-height="mode == 'month' ? 84 : 497">
          <!-- DAY HEADER -->
          <v-sheet class="day-header" :color="time.today.getTime() == date.getTime() ? 'blue2 lighten-4' : ''" :height="mode == 'month' ? 36 : 44" tile>
            <v-row class="ml-5" align="center" no-gutters>
              <v-col cols="auto">
                <v-layout column align-center>
                  <span v-if="mode != 'month' && date.getUTCDate() != 1" :class="['overline', {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{weekdays[date.getUTCDay()-1]}}</span>
                  <span v-else-if="date.getUTCDate() == 1" :class="['overline', {'mb-n2': mode == 'month'}, {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{months[date.getUTCMonth()]}}</span>
                  <span :class="[mode == 'month' ? 'subtitle-1' : 'headline', 'short', 'font-family', 'gilroy', !calendar.currentMonth || calendar.currentMonth == date.getUTCMonth() ? 'text--secondary' : 'text--disabled', 'font-weight-bold', 'font-transition', {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{date.getUTCDate()}}</span>
                </v-layout>
              </v-col>
              <v-spacer></v-spacer>
              <v-col v-if="schedules[date.toISOString()]" cols="auto">
                <v-row class="mr-5" align="center" no-gutters>
                  <v-chip v-if="schedules[date.toISOString()].variant" class="font-weight-bold" :color="schedules[date.toISOString()].variant.includes('adj') ? 'warning' : 'info'" :input-value="true" outlined x-small>
                    {{schedules[date.toISOString()].variant}}
                  </v-chip>
                  <span :class="[mode == 'month' ? 'title' : 'display-1', 'ml-3', 'mb-n1', 'font-family', 'gilroy', 'text--disabled', 'font-weight-bold', 'font-transition']">{{schedules[date.toISOString()].code}}</span>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
          <content-loader v-if="calendar.loading && mode != 'month'" :height="498" :width="180" :speed="0.5" :primary-color="$vuetify.theme.dark ? '#3C4043' : '#F1F3F4'" :secondary-color="$vuetify.theme.dark ? '#4E4F52' : '#E8EAED'">
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
            <rect x="0" y="330" rx="0" ry="0" width="180" height="10"></rect>
            <rect x="75" y="365" rx="2" ry="2" width="30" height="12"></rect>
            <rect x="50" y="385" rx="2" ry="2" width="80" height="12"></rect>
            <rect x="30" y="440" rx="2" ry="2" width="120" height="12"></rect>
          </content-loader>
          <!-- MONTH DAY CONTENT -->
          <div v-else-if="mode == 'month'" class="body-2">
            
          </div>
          <!-- WEEK DAY CONTENT -->
          <template v-else>
            <div v-if="time.today.getTime() == date.getTime() && showIndicator(time.utcNow, date)">
              <div class="error" :style="{position: 'absolute', borderTopWidth: '2px', borderTopStyle: 'solid', marginTop: '44px', top: indicatorTop(time.utcNow, date)+'px', left: 0, right: '-2px', opacity: 0.8, zIndex: 3}"></div>
              <div class="error" :style="{position: 'absolute', borderRadius: '50%', height: '10px', width: '10px', marginTop: '40px', marginLeft: '-6px', top: indicatorTop(time.utcNow, date)+'px', zIndex: 3}"></div>
            </div>
            <v-layout v-for="(group, gIndex) in computedSchedules[date.toISOString()]" :key="gIndex" :class="['group', {'first': gIndex == 0}]">
              <v-flex v-for="(column, cIndex) in group" :key="cIndex" class="column">
                <template v-for="(period, pIndex) in column">
                  <!-- LUNCH PERIOD -->
                  <v-hover v-if="period.name && period.name.toLowerCase().indexOf('lunch') != -1" :key="pIndex" v-slot:default="{hover}">
                    <!-- TODO: Find a way to extract id logic somewhere -->
                    <v-sheet :id="j+'-'+gIndex+'-'+cIndex+'-'+pIndex" class="period border lunch caption text-center d-flex" :elevation="(sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex) ? 4 : (hover ? 2 : 0)" :height="period.duration+1" tile :style="{'z-index': (sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex || hover) ? 2 : 1}" ga-on="click" ga-event-category="Lunch Menu" ga-event-action="click" @click.stop="showMenu(j+'-'+gIndex+'-'+cIndex+'-'+pIndex, date)">
                      <v-layout :class="['content', {short: period.duration <= 50 || group.length > 1}]" column align-center justify-center>
                        <div ref="periodNames">{{period.name}}</div>
                        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                        <div v-if="period.start && period.duration >= 30" class="text-no-wrap">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
                        <div v-if="period.duration >= 45 && time.utcNow >= period.start && time.utcNow <= period.end" class="overline font-weight-medium" style="letter-spacing: normal !important;">{{Math.ceil((period.end-time.utcNow)/$MS_PER_MIN)}} min. left</div>
                      </v-layout>
                    </v-sheet>
                  </v-hover>
                  <!-- REGULAR PERIOD -->
                  <v-sheet v-else :key="pIndex" class="period border caption text-center d-flex" :color="getColor(period.name) && getColor(period.name)+' lighten-5'" :height="period.duration+1" tile>
                    <v-layout :class="['content', {short: period.duration <= 50 || group.length > 1}, getColor(period.name) && getColor(period.name)+'--text text--darken-4']" column align-center justify-center>
                      <div ref="periodNames">
                        {{period.name && settings.periodNames[period.name.substring(1, 2)-1] ? settings.periodNames[period.name.substring(1, 2)-1]+" ("+period.name+")" : period.name}}
                        <span v-if="period.start && period.duration < 30 && column.length <= 1" class="text-no-wrap"> {{period.start|formatTime}}&ndash;{{period.end|formatTime}}</span>
                      </div>
                      <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                      <div v-if="period.start && period.duration >= 30" class="text-no-wrap">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
                      <div v-if="period.duration >= 50 && time.utcNow >= period.start && time.utcNow <= period.end" class="overline font-weight-medium" style="letter-spacing: normal !important;">{{Math.ceil((period.end-time.utcNow)/$MS_PER_MIN)}} min. left</div>
                    </v-layout>
                  </v-sheet>
                </template>
              </v-flex>
            </v-layout>
          </template>
          <v-layout v-if="schedules[date.toISOString()] && schedules[date.toISOString()].name" :class="['body-2', 'text-center', {'mt-4': mode != 'month'}, 'mx-2']" align-center justify-center>
            {{schedules[date.toISOString()].name}}
          </v-layout>
        </v-sheet>
        <v-timeline v-if="mode != 'month' && schedules[date.toISOString()] && schedules[date.toISOString()].events.length > 0" class="events border-thick" align-top dense>
          <v-timeline-item v-for="event in schedules[date.toISOString()].events" :key="event.name" class="caption short" :color="colors[event.category]" fill-dot small>
            <span class="text-bottom">{{event.start|formatTime}}<span v-if="event.start != event.end">&ndash;{{event.end|formatTime}}</span> • </span>
            <span class="text-bottom text--secondary">{{event.name}}</span>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
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
      if (typeof date == "string") date = new Date(date);
      return (date.getUTCHours()+11)%12+1+":"+ // convert hours to 12-hour time
             ("0"+date.getUTCMinutes()).slice(-2); // pad minutes with a 0 if necessary
    },
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
    rawSchedules: {
      type: Array,
      required: true
    },
    schedules: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    sheetId: {
      type: String,
      default: null
    },
    time: {
      type: Object,
      required: true
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
      colors: {
        important: "yellow2",
        schoolwide: "red2",
        academics: "orange2",
        athspirit: "green2",
        extra: "teal2",
        perfarts: "blue2",
        clubs: "purple2",
        special: "pink2",
        info: "bluegrey2",
        other: "brown",
      },
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
      for (const entry of this.rawSchedules) {
        if (entry.schedule.length == 0) continue;
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
          let needSplitCol = false; // need to add to previous group if there are periods that start before current one
          for (let j = i+1; j < schedule.length; j++) {
            if (schedule[i].start < period.start) {
              needSplitCol = true;
              break;
            }
          }
          if (+period.start == +prevPeriod.start) // add column if two periods start at the same time (dates are coerced to numbers)
            lastGroup.push([period]);
          else if (period.start < prevPeriod.end) // insert placeholder in new column if period starts before previous one ends
            lastGroup.push([
              {duration: (period.start-prevPeriod.end)/this.$MS_PER_MIN}, // duration of placeholder period
              period
            ]);
          else if (+period.start == +prevPeriod.end && (period.start < latestEnd || needSplitCol))
            lastGroup[lastGroup.length-1].push(period); // simply add to current column if periods are adjacent or a column split is needed
          else if (+period.start == +prevPeriod.end) // start a new period group if period starts after the previous group
            result.push([[period]]);
          else if (period.start < latestEnd || needSplitCol) // insert placeholder in current column if there's a gap between two periods or a column split is needed
            lastGroup[lastGroup.length-1].push({duration: (period.start-prevPeriod.end)/this.$MS_PER_MIN}, period); // BUGFIXED HERE
          else // insert placeholder in a new period group otherwise
            result.push([[{duration: (period.start-latestEnd)/this.$MS_PER_MIN}]], [[period]]);
          latestEnd = Math.max(latestEnd, period.end);
        }
        computedSchedules[entry.date] = result;
      }
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
     * 
     */
    getColor(period) {
      if (this.settings.showColors && period && /^P[1-7]/.test(period))
        return this.settings.periodColors[+period.substring(1, 2)-1];
      return undefined;
    },
    /**
     * Shows the lunch menu for the lunch period element at the provided ID
     * @param {string} id ID of the lunch period element
     * @param {Date} date date of the lunch menu being shown
     */
    showMenu(id, date) {
      this.$emit('show-menu', id, date);
      this.open = this.stayOpen = true;
    },
    /**
     * Determines whether to show the current time indicator for a certain date.
     * @param {Date} now  current time, adjusted to UTC
     * @param {Date} date date of the schedule in question
     * @return {boolean}  true if the current falls within the schedule range; otherwise, false
     */
    showIndicator(now, date) {
      console.log("DATE: "+date);
      let schedule = this.schedules[date.toISOString()];
      if (!schedule || schedule.schedule.length == 0) return false;
      schedule = schedule.schedule;
      return now >= schedule[0].start && now <= schedule[schedule.length-1].end;
    },
    /**
     * 
     */
    indicatorTop(now, date) {
      console.log("INDICTOP: "+(now-this.schedules[date.toISOString()].schedule[0].start)/this.$MS_PER_MIN)
      return (now-this.schedules[date.toISOString()].schedule[0].start)/this.$MS_PER_MIN;
    },
  }
};
</script>

<style scoped>
.v-chip {
  padding: 0 6px;
}
.v-sheet {
  position: relative;
}
.v-application div.border {
  border: 1px solid #9AA0A6 !important; /* for IE11 */
  border: 1px solid var(--v-secondary-base) !important;
}
.v-application div.border-thick {
  border: 2px solid #9AA0A6 !important; /* for IE11 */
  border: 2px solid var(--v-secondary-base) !important;
}
.month .cols-5 {
  width: 20%;
  max-width: 20%;
  flex: 0 0 20%;
}
.container:not(.month) .cols-5 {
  min-width: 178px;
  max-width: 178px;
}
.events {
  margin-right: -2px;
  width: 180px;
  border-radius: 2px;
}
.day-container {
  margin: 0 -2px -2px 0;
  /*-webkit-transition: width 300ms, max-width 300ms, max-height 300ms;
          transition: width 300ms, max-width 300ms, max-height 300ms;*/
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
.month .row-container {
  max-width: 710px; /* TODO: OR 711 px? */
  margin: auto;
}
.container.week {
  min-width: 932px;
}
.container:not(.month) .day-header {
  border-bottom: 2px solid #9AA0A6 !important;
  border-bottom: 2px solid var(--v-secondary-base) !important;
  border-color: var(--v-secondary-base) !important;
}
.column:not(:first-child) > .period {
  margin-left: 0;
}
.content {
  padding: 0 2px 2px;
  overflow-y: hidden;
}
.normal {
  line-height: normal;
}
.period {
  margin: 0 -1px -1px;
}
.group, .column, .period {
  transition: all 100ms;
}
.group.first {
  margin-top: -1px;
}
.lunch {
  cursor: pointer;
}
.text-bottom {
  vertical-align: text-bottom;
}
.short .overline {
  line-height: 1.3;
}
.font-transition {
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
</style>
<style>
.v-timeline-item__dot {
  margin-top: 5px;
  -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
          box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>
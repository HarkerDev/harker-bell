<template>
  <v-container fluid :class="{week: mode == 'week', day: mode == 'day'}">
    <v-row key="content" class="row-container" justify="center" no-gutters>
      <v-col v-for="(date, j) in calendar.dates" :key="date.getTime()" class="cols-5" cols="4">
        <!-- DAY CONTAINER -->
        <v-sheet ref="day" class="day-container border-thick" max-width="180" min-height="497">
          <!-- DAY HEADER -->
          <v-sheet class="day-header" :color="time.today.getTime() == date.getTime() ? 'blue2 lighten-4' : ''" height="44" tile>
            <v-row class="ml-5" align="center" no-gutters>
              <v-col cols="auto" class="text-center">
                <div v-if="date.getUTCDate() != 1" :class="['overline', {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{weekdays[date.getUTCDay()-1]}}</div>
                <div v-else-if="date.getUTCDate() == 1" :class="['overline', {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{months[date.getUTCMonth()]}}</div>
                <div :class="['headline', 'short', 'date', !calendar.currentMonth || calendar.currentMonth == date.getUTCMonth() ? 'text--secondary' : 'text--disabled', 'font-weight-bold', 'font-transition', {'blue2--text text--darken-3': time.today.getTime() == date.getTime()}]">{{date.getUTCDate()}}</div>
              </v-col>
              <v-spacer></v-spacer>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant.endsWith('-chicken')" class="headline text--primary font-transition">🐔</div>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant == 'chicken'" class="headline text--primary font-transition">🐔🐔🐔</div>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant.endsWith('-laguna')" class="headline text--primary font-transition">🏖️</div>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant == 'laguna'" class="headline text--primary font-transition">🏖️🏖️🏖️</div>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant.endsWith('-grad')" class="headline text--primary font-transition">🎓</div>
              <div v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && schedules[date.toISOString()].variant == 'grad'" class="headline text--primary font-transition">🎓🎓🎓</div>
              <v-spacer v-if="schedules[date.toISOString()] && schedules[date.toISOString()].variant && ['chicken', 'laguna', 'grad'].includes(schedules[date.toISOString()].variant.split('-')[schedules[date.toISOString()].variant.split('-').length - 1])"></v-spacer>
              <v-col v-if="schedules[date.toISOString()]" cols="auto">
                <v-row class="mr-5" align="center" no-gutters>
                  <v-chip v-if="schedules[date.toISOString()].variant && !['chicken', 'laguna', 'grad'].includes(schedules[date.toISOString()].variant)" class="font-weight-bold" :color="schedules[date.toISOString()].variant.includes('adj') ? 'warning' : (schedules[date.toISOString()].variant.includes('special') ? 'info' : 'error')" :input-value="true" outlined x-small>
                    {{schedules[date.toISOString()].variant.replace("-chicken", "").replace("-laguna", "").replace("-grad", "")}}
                  </v-chip>
                  <div class="display-1 ml-3 text--disabled font-weight-bold font-transition">{{schedules[date.toISOString()].code}}</div>
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
          <content-loader v-if="calendar.loading" :height="498" :width="180" :speed="0.5" :primary-color="$vuetify.theme.dark ? '#3C4043' : '#F1F3F4'" :secondary-color="$vuetify.theme.dark ? '#4E4F52' : '#E8EAED'">
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
          <!-- WEEK DAY CONTENT -->
          <template v-else>
            <div v-if="time.today.getTime() == date.getTime() && showIndicator(time.utcNow, date)" class="hidden-print-only">
              <div class="error indicator-line elevation-1" :style="{top: indicatorTop(time.utcNow, date)+'px'}"></div>
              <div class="error indicator-dot elevation-1" :style="{top: indicatorTop(time.utcNow, date)+'px'}"></div>
            </div>
            <v-layout v-for="(group, gIndex) in computedSchedules[date.toISOString()]" :key="gIndex" :class="['group', {'first': gIndex == 0}]">
              <v-flex v-for="(column, cIndex) in group" :key="cIndex" class="column">
                <template v-for="(period, pIndex) in column">
                  <!-- LUNCH PERIOD -->
                  <v-hover v-if="(period.name && period.name.toLowerCase().indexOf('lunch') != -1) || period.forceLunch" :key="pIndex" v-slot:default="{hover}">
                    <!-- TODO: Find a way to extract id logic somewhere -->
                    <v-sheet :id="j+'-'+gIndex+'-'+cIndex+'-'+pIndex" class="period border lunch caption text-center d-flex" :elevation="(sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex) ? 4 : (hover ? 2 : 0)" :height="period.duration+1" tile :style="{'z-index': (sheetId == j+'-'+gIndex+'-'+cIndex+'-'+pIndex || hover) ? 2 : 1}" ga-on="click" ga-event-category="lunch menu" ga-event-action="click" @click.stop="showMenu(j+'-'+gIndex+'-'+cIndex+'-'+pIndex, date)" @mousemove.stop="onMouseMove">
                      <v-layout :class="['content', {short: period.duration <= 50 || group.length > 1}]" column align-center justify-center>
                        <div ref="periodNames" class="period-name" v-html="period.name"></div>
                        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                        <div v-if="period.start && period.duration >= 30" class="text-no-wrap text--secondary">{{period.start|formatTime(settings.twentyFourHourClock)}}&ndash;{{period.end|formatTime(settings.twentyFourHourClock)}}</div>
                        <div v-if="period.duration >= 45 && time.utcNow >= period.start && time.utcNow <= period.end" class="hidden-print-only time-remain overline font-weight-medium">{{Math.ceil((period.end-time.utcNow)/$MS_PER_MIN)}} min. left</div>
                        <div class="hovercard font-weight-medium">View menu</div>
                      </v-layout>
                    </v-sheet>
                  </v-hover>
                  <!-- REGULAR PERIOD -->
                  <div v-else :key="pIndex" :style="{'text-decoration': 'none'}">
                    <v-sheet v-if="period.link" class="period regular-period border caption text-center d-flex" :color="getColor(period.name) && getColor(period.name)+' lighten-5'" :height="period.duration+1" tile :tag="period.link ? 'a' : 'div'" :href="period.link || false" target="_blank" @mousemove.stop="onMouseMove">
                      <v-layout :class="['content', {short: period.duration <= 50 || group.length > 1}, getColor(period.name) && getColor(period.name)+'--text text--darken-4']" column align-center justify-center>
                        <div ref="periodNames" class="period-name">
                          <span v-html="period.name && settings.periodNames[period.name.substring(1, 2)-1] ? settings.periodNames[period.name.substring(1, 2)-1]+' ('+period.name+')' : period.name"></span>
                          <span v-if="period.name && period.start && period.duration < 30 && column.length <= 1" class="text-no-wrap text--secondary"> {{period.start|formatTime(settings.twentyFourHourClock)}}&ndash;{{period.end|formatTime(settings.twentyFourHourClock)}}</span>
                        </div>
                        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                        <div v-if="period.name && period.start && period.duration >= 30" :class="['text-no-wrap', {'text--secondary': !getColor(period.name)}]">{{period.start|formatTime(settings.twentyFourHourClock)}}&ndash;{{period.end|formatTime(settings.twentyFourHourClock)}}</div>
                        <div v-if="period.name && period.duration >= 50 && time.utcNow >= period.start && time.utcNow <= period.end" class="hidden-print-only time-remain overline font-weight-medium">{{Math.ceil((period.end-time.utcNow)/$MS_PER_MIN)}} min. left</div>
                        <div class="hovercard font-weight-medium">
                          Open link <v-icon dark small class="material-icons-outlined hovercard-icon">launch</v-icon>
                        </div>
                      </v-layout>
                    </v-sheet>

                    <v-sheet v-else class="period regular-period border caption text-center d-flex" :color="getColor(period.name) && getColor(period.name)+' lighten-5'" :height="period.duration+1" tile :tag="'div'" @mousemove.stop="onMouseMove">
                      <v-layout :class="['content', {short: period.duration <= 50 || group.length > 1}, getColor(period.name) && getColor(period.name)+'--text text--darken-4']" column align-center justify-center>
                        <div ref="periodNames" class="period-name">
                          <span v-html="period.name && settings.periodNames[period.name.substring(1, 2)-1] && period.name.startsWith('P') ? settings.periodNames[period.name.substring(1, 2)-1]+' ('+period.name+')' : period.name"></span>
                          <span v-if="period.name && period.start && period.duration < 30 && column.length <= 1" class="text-no-wrap text--secondary"> {{period.start|formatTime(settings.twentyFourHourClock)}}&ndash;{{period.end|formatTime(settings.twentyFourHourClock)}}</span>
                        </div>
                        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                        <div v-if="period.name && period.start && period.duration >= 30" :class="['text-no-wrap', {'text--secondary': !getColor(period.name)}]">{{period.start|formatTime(settings.twentyFourHourClock)}}&ndash;{{period.end|formatTime(settings.twentyFourHourClock)}}</div>
                        <div v-if="period.name && period.duration >= 50 && time.utcNow >= period.start && time.utcNow <= period.end" class="hidden-print-only time-remain overline font-weight-medium">{{Math.ceil((period.end-time.utcNow)/$MS_PER_MIN)}} min. left</div>
                      </v-layout>
                    </v-sheet>
                  </div>
                </template>
              </v-flex>
            </v-layout>
          </template>
          <v-layout v-if="schedules[date.toISOString()] && schedules[date.toISOString()].name" class="body-2 text-center mt-4 mx-2" align-center justify-center>
            {{schedules[date.toISOString()].name}}
          </v-layout>
        </v-sheet>
        <v-timeline v-if="schedules[date.toISOString()] && schedules[date.toISOString()].events.length > 0" class="events border-thick hidden-print-only" align-top dense>
          <v-timeline-item v-for="event in schedules[date.toISOString()].events" :key="event.name" class="caption short" :color="colors[event.category]" fill-dot small>
            <template v-if="!isAllDayEvent(event)"><span class="text-bottom">{{event.start|formatTime(settings.twentyFourHourClock)}}<span v-if="event.start != event.end">&ndash;{{event.end|formatTime(settings.twentyFourHourClock)}}</span> • </span></template>
            <span class="event-name text-bottom text--secondary">{{event.name}}</span>
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
     * Returns a human-readable time from a Date object in H:MM or HH:MM format depending on `settings.twentyFourHourClock`.
     * @return {String} 12-hour time without AM/PM or 24-hour time depending on `settings.twentyFourHourClock`
     */
    formatTime(date, use24Hour) {
      if (typeof date == "string") date = new Date(date);

      if (use24Hour) {
        return date.getUTCHours() + ":" + // 24-hour time format
          ("0" + date.getUTCMinutes()).slice(-2); // pad minutes with a 0 if necessary
      } else {
        let hours = (date.getUTCHours() + 11) % 12 + 1; // convert hours to 12-hour time
        return hours + ":" + ("0" + date.getUTCMinutes()).slice(-2); // pad minutes with a 0 if necessary
      }
    },
  },
  props: {
    calendar: {
      type: Object,
      required: true
    },
    mode: {
      validator(value) {
        return ["day", "week"].indexOf(value) != -1;
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
    // twentyFourHourClock: {
    //   type: Boolean,
    //   required: true
    // }
  },
  data() {
    return {
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
        for (let i = 0; i < schedule.length; i++) {
          let period = schedule[i];
          period.start = new Date(period.start);
          period.end = new Date(period.end);
          period.duration = (period.end-period.start)/this.$MS_PER_MIN;
        }
        let result = [[[{ // create result array with first period (including its duration) as first element
          ...schedule[0],
          ...{duration: (schedule[0].end-schedule[0].start)/this.$MS_PER_MIN}}
        ]]];
        let latestEnd = schedule[0].end; // latest ending time in the current top-level period group (which can have multiple columns)
        for (let i = 1; i < schedule.length; i++) {
          let lastGroup = result[result.length-1]; // last group of periods in the schedule array being built
          let period = schedule[i], prevPeriod = schedule[i-1];
          let needSplitCol = false; // need to add to previous group if there are periods that start before current one
          for (let j = i+1; j < schedule.length; j++) {
            if (schedule[j].start < period.start) {
              needSplitCol = true;
              break;
            }
          }
          if (+period.start == +prevPeriod.start || +period.start == +lastGroup[0][0].start)
            lastGroup.push([period]); // add column if two periods start at the same time (dates are coerced to numbers)
          else if (period.start < prevPeriod.end) // insert placeholder in new column if period starts before previous one ends
            lastGroup.push([
              {duration: (period.start-lastGroup[0][0].start)/this.$MS_PER_MIN}, // duration of placeholder period
              period
            ]);
          else if (+period.start == +prevPeriod.end && (period.start < latestEnd || needSplitCol))
            lastGroup[lastGroup.length-1].push(period); // simply add to current column if periods are adjacent or a column split is needed
          else if (+period.start == +prevPeriod.end || +period.start == +latestEnd) // start a new period group if period starts after the previous group
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
    onMouseMove(e) {
      const hovercard = e.currentTarget.getElementsByClassName("hovercard")[0];
      if (hovercard) {
        hovercard.style.top = e.clientY-24+"px";
        hovercard.style.left = e.clientX+"px";
      }
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
      //console.log("DATE: "+date);
      let schedule = this.schedules[date.toISOString()];
      if (!schedule || schedule.schedule.length == 0) return false;
      schedule = schedule.schedule;
      return now >= schedule[0].start && now <= schedule[schedule.length-1].end;
    },
    /**
     *
     */
    indicatorTop(now, date) {
      //console.log("INDICTOP: "+(now-this.schedules[date.toISOString()].schedule[0].start)/this.$MS_PER_MIN)
      return (now-this.schedules[date.toISOString()].schedule[0].start)/this.$MS_PER_MIN;
    },
    /**
     * Checks if start and end date are both 00:00
     */
    isAllDayEvent(event) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      
      return (
        start.getUTCHours() === 0 &&
        start.getUTCMinutes() === 0
      ) && (
        end.getUTCHours() === 0 &&
        end.getUTCMinutes() === 0
      );
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
.v-application div.border, .v-application a.border {
  border: 1px solid #9AA0A6 !important; /* for IE11 */
  border: 1px solid var(--v-secondary-base) !important;
}
.v-application div.border-thick {
  border: 2px solid #9AA0A6 !important; /* for IE11 */
  border: 2px solid var(--v-secondary-base) !important;
}
.container .cols-5 {
  min-width: 178px;
  max-width: 178px;
}
.events {
  margin-right: -2px; /* TODO: what's this for? */
  width: 180px;
  border-radius: 2px;
}
.event-name {
  white-space: pre-wrap;
  cursor: text;
}
.day-container {
  margin: 0 -2px -2px 0;
  /*-webkit-transition: width 300ms, max-width 300ms, max-height 300ms;
          transition: width 300ms, max-width 300ms, max-height 300ms;*/
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
.container.week {
  min-width: 932px;
}
.container .v-sheet.day-header {
  border-bottom: 2px solid #9AA0A6 !important;
  border-bottom: 2px solid var(--v-secondary-base) !important;
  border-color: var(--v-secondary-base) !important;
}
.column:not(:first-child) > .period {
  margin-left: 0;
}
.content {
  padding: 0 3px;
  overflow-y: hidden;
}
.normal {
  line-height: normal;
}
.period {
  margin: 0 -1px -1px;
  text-decoration: initial;
}
.period-name {
  line-height: 1.15;
  margin: 2px 0;
}
.short .period-name {
  margin: 0 !important;
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
.date {
  margin-left: -1px;
  margin-top: -2px;
}
.indicator-line {
  position: absolute;
  border-top-width: 2px;
  border-top-style: solid;
  margin-top: 44px;
  left: 0;
  right: -2px;
  opacity: 0.8;
  z-index: 3;
}
.indicator-dot {
  position: absolute;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  margin-top: 40px;
  margin-left: -6px;
  z-index: 3;
}
.text-bottom {
  vertical-align: text-bottom;
}
.overline {
  line-height: 1.3;
}
.font-transition {
  -webkit-transition: all 300ms;
          transition: all 300ms;
}
.v-application .overline.time-remain {
  letter-spacing: normal !important;
}
.hovercard {
  height: 24px;
  display: none;
  position: fixed;
  overflow: hidden;
  padding: 2px 6px 2px 7px;
  border-radius: 2px;
  z-index: 10;
  line-height: 20px !important;
  background-color: var(--v-accent-base);
  color: #FFFFFF;
}
a.regular-period:hover .hovercard, .lunch:hover .hovercard {
  opacity: 0.8;
  display: block;
}
@media (hover: none) {
  .hovercard {
    display: none !important;
  }
}
.hovercard-icon {
  vertical-align: sub;
}
</style>
<style>
.v-timeline-item__dot {
  margin-top: 4px;
  -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
          box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>

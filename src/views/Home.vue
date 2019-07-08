<template>
  <v-container fluid style="min-width: 932px;">
    <transition-group name="schedule-transition">
      <v-layout v-if="mode == 'month'" class="overline" key="'header'" justify-center row>
        <v-sheet v-for="i in 5" :key="i" class="text-xs-center" height="24" width="150">{{i}}</v-sheet>
      </v-layout>
      <v-layout v-for="j in 5" :key="j" row justify-center wrap>
        <template v-if="(mode == 'month') ? true : (j == 2)">
          <!-- <schedule-day @toggle-menu="$emit('toggle-menu', $event)" v-for="i in 5" :key="i" :index="i" :schedule="schedule" :mode="mode"></schedule-day> -->
          <v-sheet v-for="index in 5" :key="index" class="day-container overflow-hidden" :min-width="mode == 'month' ? 150 : 180" :max-width="mode == 'month' ? 144 : 240" :max-height="mode == 'month' ? 84 : 500" min-height="84">
            <v-sheet :height="mode == 'month' ? 36 : 48" tile>
              <v-layout align-center>
                <v-flex xs3>
                  <v-layout column align-center>
                    <span v-if="mode != 'month'" class="overline">Mon</span>
                    <span :class="[mode == 'month' ? 'title' : 'headline', 'short', 'font-family', 'pt-sans', 'text--secondary', 'font-weight-bold', 'font-transition']">24</span>
                  </v-layout>
                </v-flex>
                <v-flex xs8>
                  <v-layout wrap justify-end align-center>
                    <span class="overline normal text--secondary text-xs-right font-transition" :style="{'letter-spacing': mode == 'month' ? 'normal !important' : ''}">Adjusted</span>
                    <span :class="[mode == 'month' ? 'title' : 'display-1', 'ml-1', 'font-family', 'pt-sans', 'text--disabled', 'font-weight-bold', 'font-transition']">B</span>
                  </v-layout>
                </v-flex>
                <v-flex xs1></v-flex>
              </v-layout>
            </v-sheet>
            <div v-if="displayMonthView" class="body-2">
              
            </div>
            <template v-else>
              <v-layout v-for="(group, gIndex) in computedSchedule" :key="gIndex" class="group">
                <v-flex v-for="(column, cIndex) in group" :key="cIndex" class="column">
                  <!-- <schedule-period v-for="(period, pIndex) in column" @toggle-menu="$emit('toggle-menu', $event)" :lunch="period.name && period.name.toLowerCase().indexOf('lunch') != -1" :period="period" :sheet-id="index+'-'+gIndex+'-'+cIndex+'-'+pIndex"></schedule-period> -->
                  <template v-for="(period, pIndex) in column">
                    <v-hover v-if="period.name && period.name.toLowerCase().indexOf('lunch') != -1" :key="pIndex" v-slot:default="{hover}">
                      <v-sheet :id="index+'-'+gIndex+'-'+cIndex+'-'+pIndex" class="period lunch caption text-xs-center d-flex" :elevation="open ? 4 : (hover ? 2 : 0)" :height="period.duration+1" tile @click.stop="showMenu()" :style="{'z-index': (open || hover) ? 2 : 1}">
                        <v-layout :class="{content: true, short: period.duration <= 50}" column align-center justify-center>
                          <div ref="periodNames">{{period.name}}</div>
                          <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
                          <div v-if="period.start && period.duration >= 30">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
                        </v-layout>
                      </v-sheet>
                    </v-hover>
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
        </template>
      </v-layout>
    </transition-group>
  </v-container>
</template>

<script>
export default {
  created() {
    this.updateView();
  },
  props: {
    mode: {
      validator(value) {
        return ["day", "week", "month"].indexOf(value) != -1;
      },
      required: true
    }
  },
  data() {
    return {
      view: "day",
      displayMonthView: this.mode == "month",
      open: false,
      stayOpen: true,
      scheduled: [
        
      ],
      lunch: [
        
      ],
      events: [
        
      ],
      schedule: [
        {
          name: "P1",
          start: new Date("2019-06-21T08:00Z"),
          end: new Date("2019-06-21T09:25Z")
        },
        {
          name: "P2",
          start: new Date("2019-06-21T09:35Z"),
          end: new Date("2019-06-21T11:00Z")
        },
        {
          name: "Lunch",
          start: new Date("2019-06-21T11:10Z"),
          end: new Date("2019-06-21T11:55Z")
        },
        {
          name: "Soph Mtg.",
          start: new Date("2019-06-21T11:10Z"),
          end: new Date("2019-06-21T11:25Z")
        },
        {
          name: "Lunch",
          start: new Date("2019-06-21T11:25Z"),
          end: new Date("2019-06-21T11:55Z")
        },
        {
          name: "P3",
          start: new Date("2019-06-21T12:00Z"),
          end: new Date("2019-06-21T13:25Z")
        },
        {
          name: "P4",
          start: new Date("2019-06-21T13:35Z"),
          end: new Date("2019-06-21T15:00Z")
        },
      ],
    };
  },
  computed: {
    /**
     * Processes the raw schedule array prop and constructs a new array of the following format:
     * 1st dimension: list of period groups in a day. Period groups are separated by full-width horizontal lines when displayed in week or day view.
     * 2nd dimension: column groups for each period group. Column groups are used to split schedules when there are concurrent periods, indicated by vertical lines on the page.
     * 3rd dimension: list of periods in the group, including passing periods.
     * @return {Array} three-dimensional array
     */
    computedSchedule() {
      let result = [[[{ // create result array with first period (including its duration) as first element
        ...this.schedule[0],
        ...{duration: (this.schedule[0].end-this.schedule[0].start)/60000}} // 60,000 ms per minute
      ]]];
      let latestEnd = this.schedule[0].end; // latest ending time in the current top-level period group (which can have multiple columns)
      for (let i = 1; i < this.schedule.length; i++) {
        let lastGroup = result[result.length-1]; // last group of periods in the schedule array being built
        let period = this.schedule[i], prevPeriod = this.schedule[i-1];
        period.duration = (period.end-period.start)/60000;
        if (+period.start == +prevPeriod.start) // add column if two periods start at the same time (dates are coerced to numbers)
          lastGroup.push([period]);
        else if (period.start < prevPeriod.end) // insert placeholder in new column if period starts before previous one ends
          lastGroup.push([
            {duration: (period.start-prevPeriod.end)/60000}, // duration of placeholder period
            period
          ]);
        else if (+period.start == +prevPeriod.end && period.start < latestEnd) // simply add to current column if periods are adjacent
          lastGroup[lastGroup.length-1].push(period);
        else if (+period.start == +prevPeriod.end) // start a new period group if period starts after the previous group
          result.push([[period]]);
        else if (period.start < latestEnd) // insert placeholder in current column if there's a gap between two periods
          lastGroup[lastGroup.length-1].push([[{duration: (period.start-prevPeriod.end)/60000}]], [[period]]);
        else // insert placeholder in a new period group otherwise
          result.push([[{duration: (period.start-latestEnd)/60000}]], [[period]]);
        latestEnd = Math.max(latestEnd, period.end);
      }
      return result;
    },
  },
  methods: {
    showMenu() {
      this.$root.$emit('show-menu', this.sheetId);
      this.open = this.stayOpen = true;
      console.log(this.$parent.$parent)
      let unwatch = this.$watch("$parent.$parent.$parent.$parent.$parent.$parent.menu.open", () => {
        console.log(this.stayOpen);
        if (this.stayOpen)
          this.stayOpen = false;
        else {
          this.open = false;
          unwatch();
        }
      });
    },
    updateView() {
      if (this.$route.name == "day" || this.$route.name == "month")
        this.view = this.$route.name;
    },
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
  watch: {
    $route() {
      this.updateView();
    },
    mode(value) {
      let timeout = value == "month" ? 300 : 0;
      setTimeout(() => {
        this.displayMonthView = value == "month";
      }, timeout);
    },
  }
};
</script>

<style scoped>
.schedule-transition-move {
  -webkit-transition: -webkit-transform 300ms;
          transition: transform 300ms;
}
.day-container {
  border: 1px solid #5F6368 !important;
  margin: 0 -1px -1px 0;
  -webkit-transition: min-width 300ms, max-height 300ms;
          transition: min-width 300ms, max-height 300ms;
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
  border: 1px solid #5F6368 !important;
  margin: 0 -1px -1px;
}
.lunch {
  cursor: pointer;
}
/*.group {
  transition: all 500ms;
}*/
.font-transition {
  -webkit-transition: font-size 300ms, letter-spacing 300ms;
          transition: font-size 300ms, letter-spacing 300ms;
}
</style>
<template>
  <v-sheet class="day-container overflow-y-hidden" :min-width="mode == 'month' ? 150 : 180" :max-width="mode == 'month' ? 144 : 240" :max-height="mode == 'month' ? 72 : 500" min-height="72">
    <v-sheet height="48" tile>
      <v-layout align-center>
        <v-flex xs3>
          <v-layout column align-center>
            <span class="overline">Mon</span>
            <span class="headline short font-family pt-sans text--secondary font-weight-bold">24</span>
          </v-layout>
        </v-flex>
        <v-flex xs8>
          <v-layout wrap justify-end align-center>
            <span class="overline normal text--secondary">Adjusted</span>
            <span class="ml-1 display-1 font-family pt-sans text--disabled font-weight-bold">B</span>
          </v-layout>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>
    </v-sheet>
    <template v-if="mode != 'month'">
      <v-layout v-for="(group, gIndex) in computedSchedule" :key="gIndex" class="group">
        <v-flex v-for="(column, cIndex) in group" :key="cIndex" class="column">
          <schedule-period v-for="(period, pIndex) in column" :key="pIndex" @toggle-menu="$emit('toggle-menu', $event)" :lunch="period.name && period.name.toLowerCase().indexOf('lunch') != -1" :period="period" :sheet-id="index+'-'+gIndex+'-'+cIndex+'-'+pIndex"></schedule-period>
        </v-flex>
      </v-layout>
    </template>
  </v-sheet>
</template>

<script>
import SchedulePeriod from "../components/SchedulePeriod";

export default {
  components: {
    SchedulePeriod,
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    mode: {
      validator(value) {
        return ["day", "week", "month"].indexOf(value) != -1;
      },
      required: true
    },
    /** Raw schedule fetched from either the API or IndexedDB. */
    schedule: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      scheduled: [
        
      ],
      lunch: [
        
      ],
      events: [
        
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
};
</script>

<style>
.day-container {
  border: 1px solid #5F6368 !important;
  margin-right: -1px;
  transition: min-width 250ms, max-height 250ms;
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
.group {
  transition: all 500ms;
}
</style>
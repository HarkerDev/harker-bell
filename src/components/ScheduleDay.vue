<template>
  <v-sheet class="day-container" width="180">
    <v-sheet height="50" tile>
      date
    </v-sheet>
    <v-layout v-for="group in computedSchedule" :key="group">
      <v-flex v-for="column in group" :key="column">
        <v-sheet v-for="period in column" :key="period" class="period" :height="period.duration+1" tile>
          {{period.name}}
        </v-sheet>
      </v-flex>
    </v-layout>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      schedule: [
        {
          name: "Period 1",
          start: new Date("2019-06-21T08:00Z"),
          end: new Date("2019-06-21T09:25Z")
        },
        {
          name: "Period 2",
          start: new Date("2019-06-21T09:35Z"),
          end: new Date("2019-06-21T11:00Z")
        },
        {
          name: "Lunch",
          start: new Date("2019-06-21T11:10Z"),
          end: new Date("2019-06-21T11:55Z")
        },
        {
          name: "Class Mtg.",
          start: new Date("2019-06-21T11:10Z"),
          end: new Date("2019-06-21T11:25Z")
        },
        {
          name: "Period 3",
          start: new Date("2019-06-21T12:00Z"),
          end: new Date("2019-06-21T1:25Z")
        }
      ],
      lunch: [
        
      ],
      events: [
        
      ],
    };
  },
  computed: {
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
        if (period.start == prevPeriod.start) // add column if two periods start at the same time
          lastGroup.push([period]);
        else if (period.start < prevPeriod.end) // insert placeholder in new column if period starts before previous one ends
          lastGroup.push([
            {duration: (period.start-prevPeriod.end)/60000}, // duration of placeholder period
            period
          ]);
        else if (period.start == prevPeriod.end && period.start < latestEnd) // simply add to current column if periods are adjacent
          lastGroup[lastGroup.length-1].push(period);
        else if (period.start == prevPeriod.end) // start a new period group if period starts after the previous group
          result.push([[period]]);
        else if (period.start < latestEnd) // insert placeholder in current column if there's a gap between two periods
          lastGroup[lastGroup.length-1].push([[{duration: (period.start-prevPeriod.end)/60000}]], [[period]]);
        else // insert placeholder in a new period group otherwise
          result.push([[{duration: (period.start-latestEnd)/60000}]], [[period]]);
        latestEnd = Math.max(latestEnd, period.end);
      }
      return result;
    },
  }
};
</script>

<style scoped>
.day-container {
  border: 1px solid #5F6368 !important;
  margin-right: -1px;
}
.period {
  border: 1px solid #5F6368 !important;
  margin: 0 -1px -1px;
}
/*.period+.period {
  margin-top: -1px;
}*/
</style>
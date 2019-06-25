<template>
  <v-container fluid style="min-width: 932px;">
    <v-layout row justify-center>
      <schedule-day v-for="i in 5" :key="i" :id="'day'+i" :schedule="schedule" :view="view"></schedule-day>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleDay from "../components/ScheduleDay";

export default {
  components: {
    ScheduleDay,
  },
  created() {
    this.updateView();
  },
  data() {
    return {
      view: "day",
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
  methods: {
    updateView() {
      //this.$emit("route-changed");
    }
  },
  watch: {
    $route() {
      this.updateView();
    }
  }
};
</script>

<style>
</style>
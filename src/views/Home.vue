<template>
  <v-container fluid style="min-width: 932px;">
    <transition-group name="schedule-transition">
      <v-layout v-for="j in 5" :key="j" row justify-center wrap>
        <template v-if="(mode == 'month') ? true : (j == 1)">
          <schedule-day @toggle-menu="$emit('toggle-menu', $event)" v-for="i in 5" :key="i" :index="i" :schedule="schedule" :mode="mode"></schedule-day>
        </template>
      </v-layout>
    </transition-group>
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
      if (this.$route.name == "day" || this.$route.name == "month")
        this.view = this.$route.name;
    },
  },
  watch: {
    $route() {
      this.updateView();
    }
  }
};
</script>

<style scoped>
.schedule-transition-move {
  transition: transform 250ms;
}
</style>

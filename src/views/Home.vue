<template>
  <v-container fluid>
    <v-layout row justify-center>
      <schedule-day v-for="i in 5" :key="i"></schedule-day>
    </v-layout>
  </v-container>
</template>

<script>
import ScheduleDay from "../components/ScheduleDay";

export default {
  components: {
    ScheduleDay,
  },
  data() {
    return {
      
    };
  },
};
</script>

<style>
</style>
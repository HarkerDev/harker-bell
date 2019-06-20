<template>
  <v-sheet class="day-container" width="180">
    <v-sheet height="50" tile>
      date
    </v-sheet>
    <v-sheet class="period" height="85" tile>
      P1
    </v-sheet>
    <v-sheet height="10"></v-sheet>
    <v-sheet class="period" height="85" tile>
      P2
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
};
</script>

<style scoped>
.day-container {
  border: 1px solid #5F6368 !important;
  margin-right: -1px;
}
.period {
  border-top: 1px solid #5F6368 !important;
  border-bottom: 1px solid #5F6368 !important;
}
.period+.period {
  margin-top: -1px;
}
</style>
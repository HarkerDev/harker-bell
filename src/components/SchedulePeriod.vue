<template>
  <v-hover v-if="lunch" v-slot:default="{hover}">
    <v-sheet :id="sheetId" class="period lunch caption text-xs-center d-flex" :elevation="open ? 4 : (hover ? 2 : 0)" :height="period.duration+1" tile @click.stop="showMenu()" :style="{'z-index': (open || hover) ? 2 : 1}">
      <v-layout :class="{content: true, short: period.duration <= 50}" column align-center justify-center>
        <div ref="periodNames">{{period.name}}</div>
        <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
        <div v-if="period.start && period.duration >= 30">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
      </v-layout>
    </v-sheet>
  </v-hover>
  <v-sheet v-else class="period caption text-xs-center d-flex" :height="period.duration+1" tile>
    <v-layout :class="{content: true, short: period.duration <= 50}" column align-center justify-center>
      <div ref="periodNames">{{period.name}}</div>
      <!-- Part of v-if for text height: && $refs.periodNames[gIndex+cIndex+pIndex].offsetHeight < 28 -->
      <div v-if="period.start && period.duration >= 30">{{period.start|formatTime}}&ndash;{{period.end|formatTime}}</div>
    </v-layout>
  </v-sheet>
</template>

<script>
export default {
  props: {
    lunch: {
      type: Boolean,
      default: false
    },
    period: {
      type: Object,
      required: true
    },
    sheetId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      open: false,
      stayOpen: true,
    };
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
}
</script>

<style scoped>
.period {
  border: 1px solid #5F6368 !important;
  margin: 0 -1px -1px;
}
.lunch {
  cursor: pointer;
}
</style>
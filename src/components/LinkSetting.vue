<template>
  <v-row no-gutters>
    <v-col cols="auto">
      <v-subheader class="body-1 pl-0 mr-2">{{name}}</v-subheader>
    </v-col>
    <v-col>
      <v-text-field v-model="settings.tempLinks[name]" color="accent" dense placeholder="Custom Link" :rules="[validation.url]" ga-on="focus" :ga-event-category="'link '+name" ga-event-action="input" @blur="changeLink(settings.tempLinks[name])" @focus="$event.target.select()"></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      validation: {
        url: value => {
          if (!value) return true;
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;  
          }
        },
      },
    };
  },
  methods: {
    changeLink(value) {
      if (this.validation.url(value)) {
        this.settings.links = Object.assign({}, this.settings.tempLinks); // shallow copy object
        localStorage.setItem("periodLinks", JSON.stringify(this.settings.links));
      }
    },
  },
}
</script>
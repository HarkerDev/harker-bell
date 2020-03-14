<template>
  <v-row no-gutters>
    <v-col cols="auto">
      <v-subheader class="body-1 pl-0 mr-2">P{{num}}</v-subheader>
    </v-col>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <v-text-field v-model="settings.periodNames[num-1]" color="accent" dense counter="25" maxlength="25" placeholder="Custom Name" ga-on="focus" :ga-event-category="'period '+num+' name'" ga-event-action="input" @blur="changeName" @focus="$event.target.select()"></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-select v-model="settings.periodColors[num-1]" class="mx-8" color="accent" dense :disabled="!settings.showColors" hide-details :items="settings.colors" :menu-props="{'max-width': 56}" style="width: 52px;" @input="changeColors">
            <template v-slot:item="{item}">
              <v-avatar size="24" :color="item+' lighten-5'" :class="[item+'--text', 'text--darken-4', 'caption']">
                {{colorNames[item]}}
              </v-avatar>
            </template>
            <template v-slot:selection="{item, disabled}">
              <v-avatar size="24" :color="item+' lighten-5'" :class="[item+'--text', 'text--darken-4', 'caption']" :style="{opacity: disabled ? 0.5 : 1}">
                {{colorNames[item]}}
              </v-avatar>
            </template>
            <template v-slot:append>
              <div class="v-input__icon v-input__icon--append">
                <v-icon class="material-icons-outlined">arrow_drop_down</v-icon>
              </div>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-text-field v-model="settings.tempLinks['P'+num]" color="accent" dense placeholder="Custom Link" :rules="[validation.url]" ga-on="focus" :ga-event-category="'link '+num" ga-event-action="input" @blur="changeLink(settings.tempLinks['P'+num])" @focus="$event.target.select()"></v-text-field>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      colorNames: {
        red2: "R",
        deeporange2: "RO",
        orange2: "O",
        yellow2: "Y",
        lightgreen2: "LG",
        green2: "G",
        teal2: "T",
        lightblue2: "LB",
        blue2: "B",
        indigo2: "I",
        purple2: "Pu",
        pink2: "Pi",
        bluegrey2: "Gr",
        grey2: "W",
      },
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
    changeColors() {
      localStorage.setItem("periodColors", JSON.stringify(this.settings.periodColors));
    },
    changeLink(value) {
      if (this.validation.url(value)) {
        this.settings.links = Object.assign({}, this.settings.tempLinks); // shallow copy object
        localStorage.setItem("periodLinks", JSON.stringify(this.settings.links));
      }
    },
    changeName() {
      localStorage.setItem("periodNames", JSON.stringify(this.settings.periodNames));
    },
  },
}
</script>
<template>
      <v-menu offset-y min-width="160">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only ml-2" icon aria-label="Settings" ga-on="click, contextmenu"
                 ga-event-category="settings icon" ga-event-action="click" v-on="{...menu}"
          >
            <v-icon class="material-icons-outlined">settings</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$router.push('/settings')">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item href="https://bell.harker.org/submitevent" target="_blank">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">open_in_new</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Submit an event</v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
        <v-divider></v-divider>
        <v-list dense subheader>
          <v-subheader>Change view</v-subheader>
          <v-list-item ga-on="click" ga-event-category="day" ga-event-action="click" @click="changeMode('day')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'day'" class="material-icons-outlined">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="week" ga-event-action="click" @click="changeMode('week')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'week'" class="material-icons-outlined">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-if="features.beforeInstallPrompt" color="accent" :input-value="true" ga-on="click"
                       ga-event-category="install" ga-event-action="click" @click="showInstallPrompt"
          >
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">get_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text font-weight-medium">Install app</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item ga-on="click" ga-event-category="print" ga-event-action="click" @click="print">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">print</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Print</v-list-item-title>
              <v-list-item-subtitle v-if="$vuetify.theme.dark">Light theme recommended</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
</template>

<script>
    export default {
        name: 'Settings',
        props: {
            mode: {
                type: String,
                required: true
            },
            features: {
                type: Object,
                required: true
            },
            changeMode: {
                type: Function,
                required: true
            },
        },
        methods: {
                /** Prints the current view of the bell schedule. */
                print() {
                    setTimeout(() => {
                        window.print();
                    }, 100);
                },
        }
    }
</script>

<style lang="scss" scoped>

</style>
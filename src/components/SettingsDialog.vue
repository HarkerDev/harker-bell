<template>
<v-dialog v-model="settings.dialog" :fullscreen="$vuetify.breakpoint.xsOnly"
              :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'" width="400"
              @input="closeSettings"
    >
      <v-card>
        <v-app-bar color="primary" flat>
          <v-btn icon @click="closeSettings">
            <v-icon class="material-icons-outlined">close</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-medium">Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="overline">Version {{ env.VUE_APP_VERSION }}</div>
        </v-app-bar>
        <v-list subheader>
          <v-list-item>
            <v-list-item-content :class="{'text--disabled': settings.autoDark}">Use dark mode</v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="$vuetify.theme.dark" color="accent" :disabled="settings.autoDark"
                        :inset="features.ios"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Automatic dark mode</v-list-item-title>
              <v-list-item-subtitle>Turns on from sunset to sunrise</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="settings.autoDark" color="accent" :inset="features.ios"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>Show period colors</v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="settings.showColors" color="accent" :inset="features.ios"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-text>
          <v-row>
            <v-col>
              <period-setting v-for="i in 7" :key="i" :num="i" :settings="settings"></period-setting>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="caption text-center short px-6 pb-0">
              <p>
                <a href="https://bell.harker.org/docs/api.html?utm_source=bell&utm_medium=inapp#event-categories"
                   target="_blank"
                >What do the event colors mean?</a>
              </p>
              <div>
                <v-icon class="material-icons-outlined mr-3 mt-n1" x-small>warning</v-icon>
                Schedules are only guaranteed to be accurate up to the end of the current month.
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="caption">
          <v-row>
            <v-col class="text-center short px-6 pb-0">
              <p>
                <a href="https://bell.harker.org/docs/api.html?utm_source=bell&utm_medium=inapp" target="_blank">API
                  Docs</a> • <a href="https://github.com/HarkerDev/harker-bell" target="_blank">GitHub</a> • <a
                  href="https://bell.harker.org/docs?utm_source=bell&utm_medium=inapp" target="_blank"
                >Help</a> • <a href="https://github.com/HarkerDev/harker-bell/releases" target="_blank">Release Notes</a>
              </p>
              <p class="overline">
                Made with
                <v-icon class="material-icons-outlined mt-n1" color="grey2" small>code</v-icon>
                by <a href="https://dev.harker.org/?utm_source=bell&utm_medium=hdev" target="_blank">HarkerDev</a>
              </p>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import PeriodSetting from "./PeriodSetting.vue"

	export default {
		name: 'SettingsDialog',
		components: { PeriodSetting },
		props: {
			settings: Object,
			features: Object,
			env: Object
		},
		// on load actions
		mounted() {
			// close the dialog
			this.closeSettings()

		},
		methods: {
			/** Closes the settings dialog by either navigating back in history or going to the home page. */
			closeSettings() {
				if (this.prevRoute) this.$router.back();
				else this.$router.push("/");
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
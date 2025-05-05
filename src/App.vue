<template>
  <v-app v-if="calendar.dates.length != 0">
    <v-app-bar app color="primary" elevate-on-scroll style="overflow-x: auto; opacity: 0.9;">
      <v-spacer></v-spacer>
      <v-btn class="hidden-print-only" icon aria-label="Previous" @click="nextOrPrevious(false)">
        <!--        <v-icon class="material-icons-outlined">chevron_left</v-icon>-->
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
        </svg>
      </v-btn>
      <v-menu v-model="datePicker" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{on}">
          <v-btn class="hidden-print-only" icon aria-label="Choose a date" @click="$root.sendAnalyticsHit(datePicker, 'click', 'date picker icon')" v-on="on">
            <v-icon class="material-icons-outlined">event</v-icon>
          </v-btn>
        </template>
        <v-date-picker v-model="currentDateString" :allowed-dates="allowedDate" color="accent" type="date"
                       @input="datePicker = false"
        >
          <v-spacer></v-spacer>
          <v-btn color="accent" small outlined @click="$router.push('/').catch(() => {}); datePicker = false;">
            Today
          </v-btn>
          <v-spacer></v-spacer>
        </v-date-picker>
      </v-menu>
      <v-btn class="hidden-print-only mr-2" icon aria-label="Next" @click="nextOrPrevious(true)">
        <!--        <v-icon class="material-icons-outlined">chevron_right</v-icon>-->
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
        </svg>
      </v-btn>
      <transition name="fade" mode="out-in">
        <v-toolbar-title v-if="calendar.titleChanging" key="changing" class="title text-center"
                         :style="{minWidth: $vuetify.breakpoint.smAndUp ? '205px' : '65px'}"
        >
          <template v-if="$vuetify.breakpoint.smAndUp">
            <span v-if="mode == 'week'">{{ shortMonths[calendar.dates[0].getUTCMonth()] }} {{ calendar.dates[0].getUTCDate() }} &ndash; {{ shortMonths[calendar.dates[calendar.dates.length - 1].getUTCMonth()] }} {{ calendar.dates[calendar.dates.length - 1].getUTCDate() }}, {{ calendar.dates[calendar.dates.length - 1].getUTCFullYear() }}</span>
            <span v-else>{{ longMonths[calendar.currentDate.getUTCMonth()] }} {{ calendar.currentDate.getUTCDate() }}, {{ calendar.currentDate.getUTCFullYear() }}</span>
          </template>
          <template v-else>
            <span v-if="mode == 'week'">{{ shortMonths[calendar.dates[0].getUTCMonth()] }} {{ calendar.dates[0].getUTCDate() }} - {{ shortMonths[calendar.dates[calendar.dates.length - 1].getUTCMonth()] }} {{ calendar.dates[calendar.dates.length - 1].getUTCDate() }}</span>
            <span v-else>{{ shortMonths[calendar.currentDate.getUTCMonth()] }} {{ calendar.currentDate.getUTCDate() }}, {{ calendar.currentDate.getUTCFullYear() }}</span>
          </template>
        </v-toolbar-title>
        <v-toolbar-title v-else id="title" key="title" class="headline text-center"
                         :style="{minWidth: $vuetify.breakpoint.smAndUp ? '205px' : '65px'}" @click="[$root.sendAnalyticsHit(undefined, 'click', 'changeTitle'), changeTitle()]"
        >
          <span v-if="$vuetify.breakpoint.smAndUp">Harker </span>Bell <span v-if="$vuetify.breakpoint.smAndUp"> Schedule</span>
        </v-toolbar-title>
      </transition>
      <v-menu offset-y min-width="160">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only ml-2" icon aria-label="Settings" v-on="{...menu}" 
                 @click="$root.sendAnalyticsHit(undefined, 'click', 'settings icon')"
          >
            <v-icon class="material-icons-outlined">settings</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="[$root.sendAnalyticsHit(undefined, 'click', 'settings'), $router.push('/settings')]">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">tune</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item href="https://bell.harker.org/submitevent" target="_blank"
                       @click="$root.sendAnalyticsHit(undefined, 'click', 'submitevent')"
          >
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
          <v-list-item @click="changeMode('day')">
            <v-list-item-icon>
              <v-icon v-if="mode == 'day'" class="material-icons-outlined">check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="changeMode('week')">
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
          <v-list-item v-if="features.beforeInstallPrompt" color="accent" :input-value="true" @click="[$root.sendAnalyticsHit('settings_dropdown', 'click', 'install'), showInstallPrompt()]">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-icons-outlined">get_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text font-weight-medium">Install app</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="[$root.sendAnalyticsHit(undefined, 'click', 'export'), $router.push('/export')]">
            <v-list-item-icon class="list-item-icon">
              <v-icon class="material-symbols-outlined">calendar_add_on</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="list-item-text">Export to Calendar</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="[$root.sendAnalyticsHit(undefined, 'click', 'print'), print()]">
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
      <v-menu v-model="announcementsOpen" offset-y min-width="300" content-class="hdev-announcement">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="Announcements" v-on="{...menu, click: [menu.click, toggleAnnouncements]}">
            <v-badge :value="hasUnreadAnnouncement" dot color="red2">
              <v-icon size="30" class="material-icons-outlined">campaign</v-icon>
            </v-badge>
          </v-btn>
        </template>
<!--        <div style="height: max-content; min-height: 50px; background-color: var(&#45;&#45;v-accent-base); align-items: center; padding: 4px;">-->
          <v-card style="max-width: 300px; padding: 5px;">
            <p class="text-center heading pa-0">ASB Announcements</p>
            <v-divider></v-divider>
            <div id="announcement" class="caption text-center"
                 v-html="announcement" style="margin: 3px"
            ></div>
          </v-card>

<!--        </div>-->
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y min-width="300" content-class="hdev-app-menu">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="All apps" @click="$root.sendAnalyticsHit(undefined, 'click', 'app_menu')" v-on="{...menu}">
            <!--            <v-icon class="material-icons-outlined">apps</v-icon>-->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path fill="currentColor"
                    d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
              />
            </svg>
          </v-btn>
        </template>
        <iframe id="hdev-project-menu" :src="`https://harkerdev-menu.netlify.app/?exclude=bell${$vuetify.theme.dark ? '&theme=dark' : ''}`" style="border: none; height: 100%"></iframe>
      </v-menu>
    </v-app-bar>
    <div id="message-wrapper" class="mb-2 hidden-print-only" style="height: 14px;">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div id="message" class="caption text-center" :style="{top: $vuetify.breakpoint.mdAndUp ? '62px' : '55px'}"
           v-html="message"
      ></div>
    </div>
    <v-content style="overflow-x: scroll;">
      <div class="text-center hidden-screen-only">
        <span v-if="mode == 'week'">{{ shortMonths[calendar.dates[0].getUTCMonth()] }} {{ calendar.dates[0].getUTCDate() }} &ndash; {{ shortMonths[calendar.dates[calendar.dates.length - 1].getUTCMonth()] }} {{ calendar.dates[calendar.dates.length - 1].getUTCDate() }}, {{ calendar.dates[calendar.dates.length - 1].getUTCFullYear() }}</span>
        <span v-else>{{ longMonths[calendar.currentDate.getUTCMonth()] }} {{ calendar.currentDate.getUTCDate() }}, {{ calendar.currentDate.getUTCFullYear() }}</span>
      </div>
      <router-view :calendar="calendar" :mode="mode" :raw-schedules="rawSchedules" :schedules="schedules"
                   :settings="settings" :sheet-id="menu.open ? menu.sheetId : null" :time="time" @show-menu="showMenu"
      ></router-view>
    </v-content>
    <v-dialog v-model="settings.dialog" :fullscreen="$vuetify.breakpoint.xsOnly"
              :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'" width="400"
              @input="closeSettings"
    >
      <v-card>
        <v-app-bar color="primary" flat>
          <v-btn class="ml-xs-n5 ml-md-n4" icon @click="closeSettings">
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
                        :inset="features.ios" @change="$root.sendAnalyticsHit($event, 'settings_change', 'darkModeSetting')"
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
              <v-switch v-model="settings.autoDark" color="accent" :inset="features.ios" @change="$root.sendAnalyticsHit($event, 'settings_change', 'autoDarkModeSetting')"></v-switch>
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
              <v-switch v-model="settings.showColors" color="accent" :inset="features.ios" @change="$root.sendAnalyticsHit($event, 'settings_change', 'showPeriodColorsSetting')"></v-switch>
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
                   target="_blank" @click="$root.sendAnalyticsHit('settings', 'link', 'event_categories_help')"
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
    <v-dialog v-model="settings.exportDialog" :fullscreen="$vuetify.breakpoint.xsOnly"
              :transition="$vuetify.breakpoint.xsOnly ? 'dialog-bottom-transition' : 'dialog-transition'" width="850"
              @input="closeExport"
    >
      <v-card>
        <v-app-bar color="primary" flat>
          <v-btn icon class="ml-xs-n5 ml-md-n4" @click="closeExport">
            <v-icon class="material-icons-outlined">close</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-medium">Export</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="overline">Version {{ env.VUE_APP_VERSION }}</div>
        </v-app-bar>

        <v-card-text>
          <v-tooltip color="success" bottom>
            <template v-slot:activator="{on, attrs}">
              <v-row>
                <v-text-field
                  id="export-url"
                  hide-details 
                  outlined 
                  dense 
                  rounded 
                  readonly
                  color="accent" 
                  placeholder="https://bell.dev.harker.org/api/ical/..." 
                  label="Calendar Subscription URL"
                  :value="exportUrl"
                  v-bind="attrs" v-on="on"
                  @click="[$root.sendAnalyticsHit('click', 'click', 'copy_export_url'), copyToClipboard()]"
                  @tap="[$root.sendAnalyticsHit('tap', 'click', 'copy_export_url'), copyToClipboard()]"
                ></v-text-field>
                
                <v-btn
                  class="hidden-print-only ml-6 pa-10"
                  align-self="center"
                  icon aria-label="Open Export URL" 
                  @click="[$root.sendAnalyticsHit(undefined, 'click', 'open_export_url'), openExportUrl()]"
                >
                  <v-icon class="material-symbols-outlined">open_in_new</v-icon>
                </v-btn>
              </v-row>
            </template>
            <b @touchstart="copyToClipboard">Click to copy URL!</b>
          </v-tooltip>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="py-2">
          <v-row>
            <v-col cols="12" md="5"> <!-- style="margin-bottom: 4em;" -->
              <v-sheet class="pa-2">
                <v-row>
                  <v-card-text class="pa-6">
                    <h2 class="text-h6 mb-2">
                      Choose Periods
                    </h2>
                    <v-card-text>
                      <period-setting v-for="i in 7" :key="i" :num="i" :settings="settings" :disable-text-field="!exportSettings.exportCustomNames/* || !exportSettings.includePeriods[i-1]*/">
                        <v-checkbox v-model="exportSettings.includePeriods[i-1]" class="ml-8 my-2" color="accent" dense hide-details></v-checkbox>
                      </period-setting>
                    </v-card-text>
                  </v-card-text>
                </v-row>
                <v-row>
                  <v-card-text class="py-0">
                    <v-checkbox 
                      v-model="exportSettings.exportCustomNames" 
                      class="ml-8 my-2" 
                      label="Export Custom Period Names" 
                      color="accent" 
                      :disabled="exportSettings.includePeriods.every(period => !period)"
                      dense hide-details
                    ></v-checkbox>
                  </v-card-text>
                </v-row>
              </v-sheet>
            </v-col>

            <v-col cols="12" md="7">
              <v-sheet class="pa-2">
                <v-card-text class="pa-6 pb-0">
                  <h2 class="text-h6 mb-2">
                    Extra Periods
                  </h2>
                  <v-card-text>
                    <v-chip-group
                      v-model="exportSettings.selectedExtraPeriods"
                      column
                      multiple
                      class="chip-group"
                    >
                      <v-chip
                        v-for="event in exportSettings.extraPeriods"
                        :key="event.name"
                        :value="event.id"
                        
                        filter
                        outlined
                      >
                        {{ event.name }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>

                  <h2 class="text-h6 mb-2">
                    Extra Events
                  </h2>
                  <v-card-text class="pb-0">
                    <v-chip-group
                      v-model="exportSettings.selectedExtraEvents"
                      column
                      multiple
                      class="chip-group"
                    >
                      <v-chip
                        v-for="event in exportSettings.extraEvents"
                        :key="event.name"
                        :value="event.id"
                        :color="event.color"
                        filter
                        outlined
                      >
                        {{ event.name }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card-text>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row>
            <v-col class="caption text-center short px-6 pb-0">
              <p>
                <a href="https://bell.harker.org/docs/api.html?utm_source=bell&utm_medium=inapp#event-categories" target="_blank" @click="$root.sendAnalyticsHit('export', 'link', 'event_categories_help')">
                  What do the event colors mean?</a> • <a
                  :href="`https://www.google.com/calendar/r?cid=${ encodeURIComponent(exportUrl.replace(/^https?:/, 'webcal:')) }`" target="_blank" @click="$root.sendAnalyticsHit('export', 'link', 'export_google_calendar')"
                >Use Google Calendar?</a>
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
    <v-menu v-model="menu.open" absolute :close-on-content-click="false" offset-x :position-x="menu.x"
            :position-y="menu.y"
    >
      <v-card min-height="100" max-width="480">
        <v-simple-table v-if="schedules[menu.date.toISOString()] && schedules[menu.date.toISOString()].lunch.length > 0"
                        dense fixed-header height="260"
        >
          <thead>
            <tr>
              <th class="px-5">Location</th>
              <th class="px-5">Menu Item</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="body-2 font-weight-medium px-5" style="word-break: normal;"></td>
              <td class="body-2 short py-2 px-5" style="white-space: pre-wrap; display: flex; flex-direction: row; align-items: center; margin: 1px;">
                <v-icon class="material-icons-outlined mr-3 mt-n1" x-small>warning</v-icon>
                <p style="padding-top: 10px; font-size: 10px;">
                  The lunch menu may not always be completely accurate.
                </p>
              </td>
              <td class="body-2 font-weight-medium px-5" style="word-break: normal;"></td>
            </tr>
            <tr v-for="item in schedules[menu.date.toISOString()].lunch" :key="item.place">
              <td class="body-2 font-weight-medium px-5" style="word-break: normal;">{{ item.place }}</td>
              <td class="body-2 short py-2 px-5" style="white-space: pre-wrap;">{{ item.food }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-text v-else>No lunch menu available<br>for this day.</v-card-text>
      </v-card>
    </v-menu>
    <v-footer class="hidden-print-only" app color="primary" elevation="2" fixed padless style="opacity: 0.85;">
      <div class="caption no-select mx-2">
        <span v-show="!io.connected && formattedLastConnected">Last connected: </span>
        <span
          :class="[{'error--text': time.now-io.lastConnected >= $MS_PER_DAY, 'success--text': io.connected}, 'font-weight-medium']"
        >{{ io.connected ? "Connected" : formattedLastConnected || "Connecting..." }}</span>
      </div>
      <v-spacer></v-spacer>
      <div class="caption no-select mx-2">
        <span>Last update: </span>
        <span class="font-weight-medium">{{ formattedLastUpdated || "Updating..." }}</span>
      </div>
    </v-footer>
    <v-snackbar v-model="snackbars.offlineReady" :timeout="30000">
      {{ features.beforeInstallPrompt ? 'Install this app in one click for quick and easy access.' : 'Install this app onto your home screen for quick and easy access.' }}
      <v-btn v-if="features.beforeInstallPrompt" text @click="[$root.sendAnalyticsHit('snackbar', 'click', 'install'), showInstallPrompt()]">Install</v-btn>
      <v-btn v-else text href="https://bell.harker.org/docs/install.html?utm_source=bell&utm_medium=inapp"
             target="_blank" @click="snackbars.offlineReady = false"
      >
        Learn More
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbars.pwaUpdated" :timeout="0">
      Updating to the latest version...
    </v-snackbar>
    <v-snackbar v-model="snackbars.notifDenied" :timeout="4000">
      Permission denied
      <v-icon dark class="material-icons-outlined">sentiment_dissatisfied</v-icon>
    </v-snackbar>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import PeriodSetting from "./components/PeriodSetting";

export default {
  name: "App",
  components: {
    PeriodSetting,
  },
  data() {
    return {
      env: process.env,
      socket: null,
      io: {
        connected: false,
        lastConnected: localStorage.getItem("lastConnected") || null,
        lastUpdated: localStorage.getItem("lastUpdated") || null,
      },
      db: window.db,
      mode: localStorage.getItem("calendarMode") || (this.$vuetify.breakpoint.xsOnly ? "day" : "week"),
      rawSchedules: [],
      calendar: {
        currentDate: null,
        currentMonth: null,
        dates: [],
        keepCurrentDate: false,
        titleChanging: false,
        titleTimeout: null,
        loading: false,
      },
      message: "",
      announcement: "",
      lastReadAnnouncement: localStorage.getItem("lastReadAnnouncement") || "",
      announcementsOpen: false,
      datePicker: false,
      arrowAllowed: true,
      menu: {
        open: false,
        openTracker: 0,
        date: new Date(),
        sheetId: null,
        x: 0,
        y: 0,
      },
      settings: {
        dialog: false,
        exportDialog: false,
        autoDark: localStorage.getItem("autoDark") == "true",
        enableBells: localStorage.getItem("virtualBells") != "false",
        enableNotifications: localStorage.getItem("enableNotifications") == "true",
        showColors: localStorage.getItem("showPeriodColors") == "true",
        periodColors: JSON.parse(localStorage.getItem("periodColors")) || ["blue2", "red2", "green2", "yellow2", "orange2", "teal2", "purple2"],
        periodNames: JSON.parse(localStorage.getItem("periodNames")) || [],
        links: JSON.parse(localStorage.getItem("periodLinks")) || {},
        tempLinks: JSON.parse(localStorage.getItem("periodLinks")) || {},
        colors: ["red2", "deeporange2", "orange2", "yellow2", "lightgreen2", "green2", "teal2", "lightblue2", "blue2", "indigo2", "purple2", "pink2", "bluegrey2", "grey2"],
      },
      exportSettings: {
        includePeriods: new Array(7).fill(true),
        exportCustomNames: true,
        selectedExtraPeriods: [ "School Meeting", "Advisory", "Office Hours", "Club Leadership", "No School" ],
        extraPeriods: [
          { id: "Lunch", name: "Lunch" },
          { id: "School Meeting", name: "School Mtg." },
          { id: "Advisory", name: "Advisory" },
          { id: "Club Leadership", name: "Club Leadership" },
          { id: "Office Hours", name: "Office Hours" },
          { id: "Faculty Meeting", name: "Faculty Meeting" },
          { id: "No School", name: "No School" },
          { id: "Frosh Mtg.", name: "Frosh Mtg." },
          { id: "Soph Mtg.", name: "Soph Mtg." },
          { id: "Junior Mtg.", name: "Junior Mtg." },
          { id: "Senior Mtg.", name: "Senior Mtg." },
        ],
        selectedExtraEvents: ["schoolwide", "academics", "important", "athspirit", "info"],
        extraEvents: [
          { id: "schoolwide", name: "Schoolwide", color: "yellow2" },
          { id: "academics", name: "Academics", color: "red2" },
          { id: "important", name: "Important Events", color: "orange2" },
          { id: "athspirit", name: "Athletics & Spirit", color: "green2" },
          // { id: "extra", name: "Other Departments/Extracurriculars", color: "teal2" },
          { id: "perfarts", name: "Performing Arts", color: "blue2" },
          // { id: "clubs", name: "Club Events", color: "purple2" },
          { id: "special", name: "Special Events", color: "pink2" },
          { id: "info", name: "Schedule Info", color: "bluegrey2" },
          { id: "extra,clubs,other", name: "All Other", color: "brown" },
        ],
      },
      time: {
        now: new Date(),
        utcNow: new Date(new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})) - new Date().getTimezoneOffset() * 60 * 1000),
        today: null,
      },
      snackbars: {
        notifDenied: false,
        offlineReady: false,
        pwaUpdated: false,
      },
      prevRoute: null,
      features: {
        indexedDB: window.indexedDB ? true : false,
        notif: window.Notification ? true : false,
        beforeInstallPrompt: false,
        ios: window.navigator.platform.toLowerCase().includes("ios") ||
          window.navigator.platform.toLowerCase().includes("iphone") ||
          window.navigator.platform.toLowerCase().includes("ipad"),
      },
      longMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };
  },
  computed: {
    currentDateString: {
      /** Returns the current date as an ISO string for date picker purposes. */
      get() {
        let date = this.calendar.currentDate.toISOString()
        return date.substring(0, 10);
      },
      /**
       * When set, the underlying date variable is also updated to reflect the changes.
       * @param {string} value  date string in ISO format
       */
      set(value) {
        let date = new Date(value), today = this.getCurrentUTCMidnight();
        if (+date == +today)
          this.$router.push("/");
        else
          this.$router.push(`/${value.substring(0, 4)}/${+value.substring(5, 7)}/${+value.substring(8, 10)}`);
      }
    },
    formattedLastConnected() {
      return this.formatDate(this.io.lastConnected, true);
    },
    formattedLastUpdated() {
      return this.formatDate(this.io.lastUpdated, false);
    },
    /** Converts the raw schedule array into an object. */
    schedules() {
      let obj = {};
      for (const schedule of this.rawSchedules) obj[schedule.date] = schedule;
      return obj;
    },
    /** Gets events' IDs excluded from export */
    excludedPeriods() {
      // Find unselected chips and return array of respective IDs
      return this.exportSettings.extraPeriods
        .filter(period => !this.exportSettings.selectedExtraPeriods.includes(period.id))
        .map(period => period.id);
    },
    /** Generates iCal feed url for selected periods and events */
    exportUrl() {
      const url = new URL('https://bell.dev.harker.org/api/ical/feed');
      const { selectedExtraEvents, extraEvents, selectedExtraPeriods, includePeriods, exportCustomNames } = this.exportSettings;
      const includeSchedule = selectedExtraPeriods.length > 0 || !includePeriods.every(e => !e);
      const includeEvents = selectedExtraEvents.length > 0;
      if (includeSchedule) {
        const excluded = [];
        excluded.push(...this.excludedPeriods)
        includePeriods.map((period, index) => {if (!period) excluded.push(`P${index+1}`)})
        if (excluded.length > 0) url.searchParams.append('exclude', excluded.join(','))
        url.searchParams.append('includeSchedule', '');
      }

      if (includeEvents) {
        if (selectedExtraEvents.length == extraEvents.length) {
          url.searchParams.append('includeEvents', 'all')
        } else {
          url.searchParams.append('includeEvents', selectedExtraEvents.join(','))
        }
      }

      url.searchParams.append("t", (new Date).getTime());
      url.searchParams.append("v", process.env.VUE_APP_VERSION);

      if (exportCustomNames && includeSchedule && !this.settings.periodNames.every(item => !item)) url.searchParams.append('periodNames', btoa(this.settings.periodNames))
      return url.toString();
    },
    hasUnreadAnnouncement() {
      return this.announcement != this.lastReadAnnouncement && this.announcement != "";
    }
  },
  watch: {
    /** Responds to route changes. */
    $route(route, prevRoute) {
      this.prevRoute = prevRoute;
      this.settings.dialog = route.name == "settings";
      this.settings.exportDialog = route.name == "export";
      if (["home", "day"].includes(route.name)) this.setCalendar(route);
      this.changeTitle();
    },
    /** Responds to lunch menu changes by keeping it open when choosing a different date. */
    "menu.open"(open) {
      if (open == false && this.menu.openTracker > 0)
        this.$nextTick(() => {
          this.menu.open = true;
          this.menu.openTracker--;
        });
    },
    /** Handles changes to the dark mode setting. */
    "$vuetify.theme.dark"(dark) {
      localStorage.setItem("darkTheme", dark.toString());
      if (dark) document.querySelector('meta[name="theme-color"]').setAttribute("content", "#202124");
      else document.querySelector('meta[name="theme-color"]').setAttribute("content", "#FFFFFF");

      if (document.getElementById('hdev-project-menu')) document.getElementById('hdev-project-menu').contentWindow.location.reload();

      if (window.gtag) window.gtag('set', 'user_properties', { 'darkTheme': dark.toString() });
    },
    /** Handles changes to the automatic dark mode setting. */
    "settings.autoDark"(autoDark) {
      localStorage.setItem("autoDark", autoDark.toString());
      if (window.gtag) window.gtag('set', 'user_properties', { 'autoDark': autoDark.toString() });
      if (autoDark) {
        window.initializeAutoDark();
        if (localStorage.getItem("darkTheme") == "true") this.$vuetify.theme.dark = true;
        else this.$vuetify.theme.dark = false;
      }
    },
    /** Handles changes to the period colors toggle setting. */
    "settings.showColors"(showColors) {
      localStorage.setItem("showPeriodColors", showColors.toString());
      if (window.gtag) window.gtag('set', 'user_properties', { 'showPeriodColors': showColors.toString() });
    },
    /** Handles changes to the virtual bells toggle setting. */
    "settings.enableBells"(enabled) {
      localStorage.setItem("virtualBells", enabled.toString());
      if (window.gtag) window.gtag('set', 'user_properties', { 'virtualBells': enabled.toString() });
    },
    "settings.enableNotifications"(enabled) {
      if (!window.Notification) return;

      function setVars() {
        localStorage.setItem("enableNotifications", enabled.toString());
        if (window.gtag) window.gtag('set', 'user_properties', { 'enableNotifications': enabled.toString() });
      }

      function notifPromise() {
        try {
          Notification.requestPermission().then();
        } catch (e) {
          return false;
        }
        return true;
      }

      function showNotif() {
        const notif = new Notification("Successfully enabled notifications!", {
          body: "You'll receive notifications for each class that has a custom link.",
          icon: "/img/icons/android-chrome-192x192.png",
        });
        notif.addEventListener("click", () => notif.close());
      }

      function handlePermission(permission, thisV) {
        if (!Notification.permission) Notification.permission = permission;
        if (permission == "granted") {
          setVars();
          showNotif();
        } else {
          thisV.settings.enableNotifications = false;
          thisV.snackbars.notifDenied = true;
        }
      }

      if (!enabled) return setVars();
      if (Notification.permission == "granted") {
        setVars();
        showNotif();
      } else if (notifPromise())
        Notification.requestPermission().then(permission => handlePermission(permission, this));
      else
        Notification.requestPermission(permission => handlePermission(permission, this));
    },
    "lastReadAnnouncement"(lastReadAnnouncement) {
      localStorage.setItem("lastReadAnnouncement", lastReadAnnouncement)
    }
  },
  async created() {
    //console.log(new Date-abcd);
    //console.log(new Date-abcd);
    /** Number of milliseconds per minute and day */
    this.$MS_PER_MIN = 60 * 1000;
    this.$MS_PER_DAY = this.$MS_PER_MIN * 60 * 24;
    if (localStorage.getItem("darkTheme") == "true") {
      this.$vuetify.theme.dark = true;
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#202124");
    } else
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#FFFFFF");
    window.addEventListener("pwaOfflineReady", () => this.snackbars.offlineReady = true);
    window.addEventListener("pwaUpdated", () => {
      this.snackbars.pwaUpdated = true;
      this.$nextTick(() => window.location.reload());
    });
    window.addEventListener("beforeinstallprompt", (e) => this.features.beforeInstallPrompt = e);
    window.addEventListener("appinstalled", () => this.features.beforeInstallPrompt = false);
    window.addEventListener("storage", (event) => {
      let key = event.key;
      if (!key) return;

      this.$nextTick(() => {
        if (key == 'showPeriodColors') key = 'showColors';
        if (key == 'periodLinks') key = "links";

        switch (key) {
        case 'darkTheme': {
          this.$vuetify.theme.dark = event.newValue === 'true';
          break;
        }
        case 'lastReadAnnouncement': {
          this.lastReadAnnouncement = event.newValue;
          break;
        }

        case 'showColors':
        case 'links':
        case 'autoDark':
        case 'periodColors':
        case 'periodNames':
          this.settings[key] = JSON.parse(event.newValue);
          break;
        }
      });
    })
    this.time.today = this.getCurrentUTCMidnight();
    //console.log("STARTING:\t", new Date-abcd);
    await this.setCalendar(this.$route);
    const socketWhitelist = [
      "127.0.0.1:5000",
      "127.0.0.1:5001",
      "127.0.0.1:5002",
      "http://127.0.0.1:5000",
      "http://127.0.0.1:5001",
      "http://127.0.0.1:5002",
    ];
    const manualSocket = this.$route.query.server;

    // Silently fall back to main socket if query parameter not whitelisted
    this.socket = io((manualSocket && socketWhitelist.includes(manualSocket)) ? manualSocket : "https://bell.dev.harker.org");
    this.socket.on("connect", () => {
      //console.log("SOCK CONN:\t", new Date-abcd);
      this.io.connected = true;
      if (this.db) this.socket.emit("request update", localStorage.getItem("scheduleRevision"));
    });
    this.socket.on("disconnect", () => {
      this.io.connected = false;
      //console.log(reason);
    });
    this.socket.on("update message", message => {
      this.message = message;
      this.$nextTick(() => {
        const el = document.getElementById("message-wrapper");
        if (el) el.style.height = document.getElementById("message").clientHeight + "px";
      });
    });
    this.socket.on("update announcement", (announcement, noBadge) => {
      this.announcement = announcement;
      if (noBadge || this.announcementsOpen) this.lastReadAnnouncement = announcement;
    });
    if (this.db) this.socket.on("update schedule", async (schedules, revision) => {
      if (revision) {
        for (const schedule of schedules)
          await this.db.put("schedules", schedule);
        let now = new Date();
        this.io.lastUpdated = now;
        localStorage.setItem("lastUpdated", now.getTime());
        if(revision != "backup") {
          localStorage.setItem("scheduleRevision", revision);
        }
        await this.setCalendar(this.$route);
      }
    });
    const startTone = new Audio("/tones/start.mp3");
    const endTone = new Audio("/tones/end.mp3");
    startTone.volume = endTone.volume = 0.7;
    this.socket.on("pong", () => {
      let now = new Date();
      this.io.lastConnected = now;
      localStorage.setItem("lastConnected", now.getTime());
    });
    if (!localStorage.getItem("scheduleRevision")) this.getFromSocket(this.calendar.dates);
    //console.log("INIT DONE:\t", new Date-abcd);
  },
  mounted() {
    setInterval(() => this.updateTime(), this.$MS_PER_MIN, this);
    document.addEventListener("visibilitychange", () => {
      //console.log(document.hidden);
      if (!document.hidden) this.updateTime();
    });
    window.addEventListener("keydown", event => {
      if (this.settings.dialog || this.settings.exportDialog) return;

      if (event.key == "ArrowRight" || event.keyCode == 39) this.nextOrPrevious(true);
      else if (event.key == "ArrowLeft" || event.keyCode == 37) this.nextOrPrevious(false);
      else if (event.key == "ArrowDown" || event.keyCode == 40 ||
        event.key == "KeyT" || event.keyCode == 84) this.$router.push("/").catch(() => {
      });
      else if (event.key == "KeyD" || event.keyCode == 68) this.changeMode("day");
      else if (event.key == "KeyW" || event.keyCode == 87) this.changeMode("week");
      else if (event.key == "KeyR" || event.keyCode == 82) this.updateTime();
      else if (event.key == "KeyE" || event.keyCode == 69) this.$router.push("/export").catch(() => {});
    });
    // TODO: FIX DIALOG NOT SHOWING UP ON PAGE LOAD (SETTINGS ROUTE)
    setTimeout(() => this.settings.dialog = this.$route.name == "settings", 250); // TEMPORARY FIX
    setTimeout(() => this.settings.exportDialog = this.$route.name == "export", 250);
  },
  methods: {
    /**
     * Determines if the date represented by a given ISO date is allowed in the date picker.
     * @param {string} dateString date as an ISO date string (YYYY-MM-DD format)
     * @return                    true if the date falls on a weekday; otherwise, false
     */
    allowedDate(dateString) {
      let date = new Date(dateString);
      return date.getUTCDay() > 0 && date.getUTCDay() < 6;
    },
    /**
     * Changes the calendar display mode.
     * @param {string} mode the mode to change the view to (either "day" or "week")
     */
    changeMode(mode) {
      this.saveMode(this.mode = mode);
      this.$root.sendAnalyticsHit(mode, 'click', 'change_mode')
      this.calendar.keepCurrentDate = true;
      let today = this.getCurrentUTCMidnight(), date = new Date(+this.calendar.currentDate);
      if (mode == "week" && this.$route.name == "day" &&
        +this.getSaturday(new Date(+date)) == +this.getSaturday(new Date(+today)))
        this.$router.push("/");
      else this.setCalendar(this.$route);
    },
    /** Changes the bell schedule title to briefly show the current date range. */
    changeTitle() {
      if (this.calendar.titleTimeout) {
        this.calendar.titleChanging = true;
        clearTimeout(this.calendar.titleTimeout);
        this.calendar.titleTimeout = setTimeout(() => {
          this.calendar.titleChanging = false;
        }, 2000);
      } else this.calendar.titleTimeout = true;
    },
    /** Closes the settings dialog by either navigating back in history or going to the home page. */
    closeSettings() {
      if (this.prevRoute) this.$router.back();
      else this.$router.push("/");
    },
    /** Closes the export dialog by either navigating back in history or going to the home page. */
    closeExport() {
      if (this.prevRoute) this.$router.back();
      else this.$router.push("/");
    },
    /** Copies the export url to user's clipboard */
    copyToClipboard() {
      navigator.clipboard.writeText(this.exportUrl).catch(err => {
        console.error('Failed to copy: ', err);
      });
    },
    /** Opens the export url in any installed calendar app */
    openExportUrl() {
      window.location.href = this.exportUrl.replace(/^https?:/, 'webcal:')
      // window.open(this.exportUrl.replace(/^https?:/, 'webcal:'), '_blank');
    },
    /**
     * Formats a date into a human-readable representation. Can optionally omit the time portion.
     * @param {Date} date         date to be formatted
     * @param {boolean} showTime  whether or not to include the time portion of the date
     * @return {string}           formatted date string, based on locale
     */
    formatDate(timestamp, showTime) {
      if (!timestamp) return null;
      let date = new Date(+timestamp);
      if (new Date().setHours(0, 0, 0, 0) == new Date(+timestamp).setHours(0, 0, 0, 0))
        return date.toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
      if (!showTime)
        return date.toLocaleDateString(undefined, {month: "numeric", day: "numeric", year: "2-digit"});
      return date.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit"
      });
    },
    /** Runs when user opens announcement menu */
    toggleAnnouncements() {
      this.$nextTick(() => {
        this.$root.sendAnalyticsHit(this.announcementsOpen, 'click', 'announcement')
        
        if (!this.announcementsOpen) return; // Don't mark as read if closing announcements menu

        if (this.announcement && this.lastReadAnnouncement != this.announcement) 
          this.$root.sendAnalyticsHit(this.announcement, 'click', 'readUnreadAnnouncement')
        this.lastReadAnnouncement = this.announcement;
      })
    },
    /**
     * Retrives local schedules from IndexedDB if available.
     * @param {Date[]} dates  array of dates
     * @return {Object[]}     array of schedules retrieved from IndexedDB, or an empty array if not available
     */
    async getFromIndexedDB(dates) {
      let schedules = [];
      //console.log("GET IDB:\t", new Date-abcd);
      if (this.db) {
        // if fewer than 10 schedules in IndexedDB then assume something broke and refetch
        if (localStorage.getItem("scheduleRevision") && await this.db.count("schedules") < 10) {
          localStorage.removeItem("scheduleRevision");
          window.location.reload();
        }
        await Promise.all(dates.map(async date => {
          //console.log("GETTING:\t", new Date-abcd);
          let schedule = await this.db.get("schedules", date.toISOString());
          if (schedule) schedules.push(schedule);
          //console.log("GOTTEN:\t", new Date-abcd);
        }));
      }
      //console.log("GOT IDB:\t", new Date-abcd);
      return schedules;
    },
    /**
     * Retrives remote schedules using the websocket.
     * @param {Date[]} dates  array of dates
     */
    getFromSocket(dates) {
      //console.log("getFromSocket");
      this.calendar.loading = true;
      this.socket.emit("request schedule", {
        start: dates[0],
        end: dates[dates.length - 1]
      }, schedules => {
        //console.log("GOT SOCK:\t", new Date-abcd);
        this.rawSchedules = schedules;
        this.calendar.loading = false;
        //console.log(this.db);
      });
    },
    /**
     * Calculates the start of the current day, which is defined as the last midnight on or before the current
     * timestamp, and expressed in UTC time.
     * @return {Date} midnight in UTC of the current time
     */
    getCurrentUTCMidnight() {
      let now = new Date();
      let date = new Date(now - now.getTimezoneOffset() * this.$MS_PER_MIN);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    /**
     * Calculates the date of the last sunday on or before a given date.
     * @param {Date} date the date to use for calculating sunday
     * @return {Date}     the latest sunday on or before date
     */
    getSaturday(date) {
      date = new Date(date);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 1) % 7); // mod 7 days
      return date;
    },
    /**
     * Navigates to the next or previous view, depending on the current calendar mode selected.
     * @param isNext {boolean}  true if next; false if previous
     */
    nextOrPrevious(isNext) {
      if (!this.arrowAllowed) return;
      this.arrowAllowed = false;
      let sign = isNext ? 1 : -1;
      let today = this.getCurrentUTCMidnight(), date = new Date(+this.calendar.currentDate);
      if (this.mode == "week") {
        date = this.getSaturday(new Date(+date + sign * 7 * this.$MS_PER_DAY));
        date.setUTCDate(date.getUTCDate() + 2);
        // if going next and it's a friday, then skip directly to monday, and vice versa
      } else if (isNext && date.getUTCDay() == 5 || !isNext && date.getUTCDay() == 1)
        date.setUTCDate(date.getUTCDate() + sign * 3);
      else // day mode
        date.setUTCDate(date.getUTCDate() + sign * 1);

      let newRoute;
      if (+date == +today || this.mode == "week" && +this.getSaturday(date) == +this.getSaturday(today))
        newRoute = "/";
      else
        newRoute = `/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

      this.$router.push(newRoute);
      this.$root.sendAnalyticsHit(newRoute, 'click', isNext ? 'next' : 'previous')

      this.arrowAllowed = true;
    },
    /** Prints the current view of the bell schedule. */
    print() {
      setTimeout(() => {
        window.print();
      }, 100);
    },
    /**
     * Saves the calendar mode to local storage.
     * @param {string} mode the current calendar view mode
     */
    saveMode(mode) {
      localStorage.setItem("calendarMode", mode);
      if (window.gtag) window.gtag('set', 'user_properties', { 'calendarMode': mode });
    },
    /**
     * Sets the calendar dates that will be displayed to the user based on the current view setting
     * and the date specified in the URL path.
     * @param {Route} route the current route object
     */
    async setCalendar(route) {
      //console.log("SETCALENDAR: ", route);
      //console.log("BEGINCAL:\t", new Date-abcd);
      if (this.$route.name == "day" && !["day", "week"].includes(this.mode))
        this.saveMode(this.mode = "week");
      let year = +route.params.year, month = +route.params.month, day = +route.params.day;
      if (!this.calendar.keepCurrentDate)
        if (year && month) {
          this.calendar.currentDate = new Date(Date.UTC(year, month - 1, day || 1));
          if (!day && this.calendar.currentDate.getUTCDay() == 0)
            this.calendar.currentDate = new Date(+this.calendar.currentDate + this.$MS_PER_DAY);
          else if (!day && this.calendar.currentDate.getUTCDay() == 6)
            this.calendar.currentDate = new Date(+this.calendar.currentDate + 2 * this.$MS_PER_DAY);
        } else this.calendar.currentDate = this.getCurrentUTCMidnight();
      else this.calendar.keepCurrentDate = false;
      this.calendar.currentMonth = null;
      /** @type {Date} */
      let startDate, endDate;
      if (this.mode == "week") {
        if (route.name == "day")
          startDate = this.getSaturday(new Date(Date.UTC(year, month - 1, day))); // date in URL
        else
          startDate = this.getSaturday(new Date(+this.calendar.currentDate)); // saturday of the current week
        endDate = new Date(+startDate + 6 * this.$MS_PER_DAY); // add 6 days to get friday
      } else if (route.name == "day") { // is day route
        startDate = endDate = new Date(Date.UTC(year, month - 1, day)); // date specified in URL
        let date = this.calendar.currentDate;
        if (date.getUTCDay() == 0) date = new Date(+date + this.$MS_PER_DAY);
        else if (date.getUTCDay() == 6) date = new Date(+date + 2 * this.$MS_PER_DAY);
        if (+date != +this.calendar.currentDate) {
          this.$router.push(`/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`);
          return;
        }
      } else { // if no date specified in URL path
        startDate = endDate = this.calendar.currentDate;
        if (startDate.getUTCDay() == 0) startDate = endDate = new Date(+startDate + this.$MS_PER_DAY);
        else if (startDate.getUTCDay() == 6) startDate = endDate = new Date(+startDate + 2 * this.$MS_PER_DAY);
        this.calendar.currentDate = startDate;
      }
      let dates = [];
      while (startDate <= endDate) {
        if (startDate.getUTCDay() > 0 && startDate.getUTCDay() < 6) // if date is a weekday
          dates.push(startDate);
        startDate = new Date(+startDate + this.$MS_PER_DAY); // add 1 day
      }
      if (this.db) this.rawSchedules = await this.getFromIndexedDB(dates);
      else if (this.socket) this.getFromSocket(dates);
      this.calendar.dates = dates;
      //console.log("SET CAL:\t", new Date-abcd);
    },
    /** Shows the PWA install prompt, if available. */
    showInstallPrompt() {
      if (this.features.beforeInstallPrompt) {
        this.snackbars.offlineReady = false;
        this.features.beforeInstallPrompt.prompt();
      }
    },
    /**
     * Opens the panel displaying the lunch menu next to the appropriate date when the show-menu event is emitted.
     * @param {string} id ID of the lunch period element
     * @param {Date} date date of the lunch menu being shown
     */
    showMenu(id, date) {
      this.menu.date = date;
      this.menu.sheetId = id;
      if (this.menu.open) {
        this.menu.openTracker = 2;
        this.menu.open = false; // required in order for the position transition to work
      }
      let rect = document.getElementById(id).getBoundingClientRect();
      this.menu.x = rect.left + rect.width;
      this.menu.y = rect.top;
      this.$nextTick(() => {
        this.menu.open = true;
      });

      let daysEarly = Math.round((
        new Date(date.toDateString()) - 
        new Date(new Date().toDateString())
      ) / this.$MS_PER_DAY) + 1;
      let hoursEarly = (new Date(date.toDateString()).getTime()-Date.now()+this.$MS_PER_DAY)/(60000*60);
      let hasLunch = this.schedules[date.toISOString()] && this.schedules[date.toISOString()].lunch.length > 0;

      this.$root.sendAnalyticsHit(hasLunch, 'lunch', 'lunchMenu', { daysEarly, hoursEarly, 'lunch_date': date.toISOString() })
    },
    /** Handler that runs every minute and on page focus. */
    updateTime() {
      //console.log("updating...");
      this.time.now = new Date();
      this.time.today = this.getCurrentUTCMidnight();
      this.time.utcNow = new Date(new Date(this.time.now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})) - this.time.now.getTimezoneOffset() * this.$MS_PER_MIN);
      if (this.settings.autoDark && this.time.now >= window.nextSunRiseSet.time) {
        if (window.nextSunRiseSet.isSunrise) this.$vuetify.theme.dark = false;
        else this.$vuetify.theme.dark = true;
        window.nextSunRiseSet = window.getNextSunRiseSet(this.time.now);
      }
    },
  },
};
</script>

<style>
.v-snack__wrapper {
  border-radius: 2px !important;
}

.v-date-picker-title__date {
  font-size: 22px !important;
}

.v-menu__content {
  max-width: 95% !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.short {
  line-height: 1.15 !important;
}

#message {
  position: absolute;
  max-width: 550px;
  width: 90%;
  left: 50%;
  top: 55px;
  transform: translateX(-50%);
  line-height: normal;
}

#title {
  font-size: 22px !important;
  cursor: pointer;
}

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#export-url {
  /* Not Working on Export URL Field :( */
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;

  color: #BDC1C6; 
}

.chip-group div {
  touch-action: manipulation;
}

.v-list-item__icon:first-child {
  margin-right: 18px !important;
}

.list-item-icon {
  margin-top: 10px;
  margin-bottom: 8px;
}

.list-item-text {
  font-size: 15px;
}

.blink {
  animation: blink 1.25s step-start infinite;
}

.blink2 {
  animation: blink2 1.25s step-start infinite;
}

.blink.collapse {
  animation: blink-collapse 1.25s step-start infinite;
}

.blink2.collapse {
  animation: blink2-collapse 1.25s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes blink2 {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes blink-collapse {
  50% {
    display: none;
  }
}

@keyframes blink2-collapse {
  0%, 100% {
    display: none;
  }
  50% {
    display: unset;
  }
}

@media print {
  @page {
    size: landscape;
  }
}

body {
  -webkit-print-color-adjust: exact !important;
}

.v-content__wrap {
  overflow-x: auto;
}

.v-input__slot:before {
  border-top-width: 1px !important;
}

.v-text-field > .v-input__control > .v-input__slot:after {
  border-width: 1px 0 1px 0;
}

.hdev-app-menu {
  overflow: hidden;
  height: 312px;
  padding-top: 4px;
  /* background-color: #FFFFFF; */
}

.v-btn.v-date-picker-table__current.v-btn--disabled .v-btn__content {
  color: #BDC1C6;
}

.v-date-picker-header .material-icons {
  font-family: "Material Icons Outlined";
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "liga";
}
</style>

<template>
	<div>
		<v-menu offset-y min-width="300" content-class="hdev-announcement">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="Announcements" ga-on="click, contextmenu"
                 ga-event-category="app menu" ga-event-action="click" v-on="{...menu}"
          >
            <v-icon color="#0ebf8f" size="30" class="material-icons-outlined">campaign</v-icon>
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
	</div>
</template>

<script>
	export default {
		name: "Announcements",
		props: {
			announcement: {
				type: String,
				required: true
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
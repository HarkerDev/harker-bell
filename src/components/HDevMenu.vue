<template>
      <v-menu offset-y min-width="300" content-class="hdev-app-menu">
        <template v-slot:activator="{on: menu}">
          <v-btn class="hidden-print-only" icon aria-label="All apps" ga-on="click, contextmenu"
                 ga-event-category="app menu" ga-event-action="click" v-on="{...menu}"
          >
            <!--            <v-icon class="material-icons-outlined">apps</v-icon>-->
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path fill="currentColor"
                    d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
              />
            </svg>
          </v-btn>
        </template>
        <iframe src="https://harkerdev-menu.netlify.app/?exclude=bell" style="border: none; height: 100%"></iframe>
      </v-menu>
</template>

<script>
  export default {
    name: "HMenu"
  }
</script>

<style lang="scss" scoped>

</style>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="o_menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Docs",
          caption: "quasar.dev",
          icon: "o_school",
          link: "https://quasar.dev",
        },
        {
          title: "Github",
          caption: "github.com/quasarframework",
          icon: "o_code",
          link: "https://github.com/quasarframework",
        },
        {
          title: "Discord Chat Channel",
          caption: "chat.quasar.dev",
          icon: "o_chat",
          link: "https://chat.quasar.dev",
        },
        {
          title: "Forum",
          caption: "forum.quasar.dev",
          icon: "o_record_voice_over",
          link: "https://forum.quasar.dev",
        },
        {
          title: "Twitter",
          caption: "@quasarframework",
          icon: "o_rss_feed",
          link: "https://twitter.quasar.dev",
        },
        {
          title: "Facebook",
          caption: "@QuasarFramework",
          icon: "o_public",
          link: "https://facebook.quasar.dev",
        },
      ],
    };
  },
};
</script>
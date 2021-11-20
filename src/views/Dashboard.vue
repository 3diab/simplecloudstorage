<template>
  <v-app>
    <v-navigation-drawer app color="grey lighten-5" floating>
      <v-container>
        <v-row justify="center" no-gutters>
          <v-col>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-light text-h5 text-center"
                >
                  Simple <span class="font-weight-medium">Files</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-btn
              dark
              block
              depressed
              color="blue"
              class="text-none font-weight-light mt-5 text-h6 py-6"
            >
              <v-icon class="mr-2">mdi-plus</v-icon> Create New</v-btn
            >

            <v-list nav>
              <v-list-item v-for="item in mainMenuItems" :key="item.title" link>
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-regular text-subtitle-1"
                    >{{ item.title }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="signOut()" block depressed color="grey darken-3" dark>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app flat color="white">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title
        >Welcome, {{ $store.getters["User/getUserEmail"] }}</v-toolbar-title
      >
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Dashboard",
  data: () => ({
    mainMenuItems: [
      { title: "My Files", icon: "mdi-folder" },
      { title: "Trash", icon: "mdi-trash-can" },
      { title: "About", icon: "mdi-help-box" },
    ],
  }),
  methods: {
    async signOut() {
      this.$store.dispatch("User/signOut");
    },
  },
});
</script>

<template>
  <v-app>
    <v-navigation-drawer app floating>
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

            <v-divider></v-divider>

            <v-list nav>
              <v-list-item
                v-for="item in mainMenuItems"
                :key="item.title"
                link
                :to="item.to"
              >
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
    <v-app-bar app flat color="transparent">
      <v-app-bar-title class="grey--text text--darken-1 text-subtitle-1"
        >Welcome,
        <span class="grey--text text--darken-4 font-weight-bold">
          {{ $store.getters["User/getUserName"] }}</span
        ></v-app-bar-title
      >

      <v-container class="mx-6">
        <v-row>
          <v-col cols="8">
            <v-spacer></v-spacer>
            <v-text-field
              solo
              label="Search"
              flat
              hide-details
              background-color="white"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
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
      { title: "My Files", icon: "mdi-folder", to: { name: "Browser" } },
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
<style>
.v-bar-border {
  background-color: red;
  border-width: 0 0 thin 0;
  border-style: solid;
  border-bottom-color: #0000001f !important;
}
.v-application {
  background-color: #e9e9e9 !important;
}
</style>

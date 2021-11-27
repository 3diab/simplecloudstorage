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
                color="light-blue darken-2"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-medium text-subtitle-1"
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
    <v-navigation-drawer app floating right v-model="rightSidebar">
      <v-card flat tile>
        <v-card-title> File Name </v-card-title>

        <v-card-subtitle>Type</v-card-subtitle>

        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <span class="text-subtitle-1 font-weight-regular">Details</span>
            </v-row>
            <v-row> Created : </v-row>
            <v-row> Modified : </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar app absolute flat color="transparent">
      <v-container class="mx-6">
        <v-row justify="end">
          <v-col cols="8">
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
    rightSidebar: true,
    mainMenuItems: [
      { title: "My Files", icon: "mdi-folder", to: { name: "Browser" } },

      { title: "Help", icon: "mdi-help-box" },
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

<template>
  <v-app>
    <v-navigation-drawer app floating v-model="leftSidebar">
      <v-container>
        <v-row justify="center" no-gutters>
          <v-col>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-light text-h5 text-center"
                  ><v-img
                    src="../assets/images/openarcloud_logo.png"
                    height="80"
                    contain
                  ></v-img>
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
    <v-navigation-drawer
      app
      floating
      right
      v-if="$store.getters['Main/getRightSidebarState']"
    >
      <v-card flat tile>
        <v-toolbar flat dense>
          <v-toolbar-title>
            {{ getSelectedFile.__data.key }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small icon @click="closeRightSidebar()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>

        <v-card-subtitle></v-card-subtitle>

        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field
                :disabled="getSelectedFile.__data.key.slice(-1) === '/'"
                :value="$store.getters['Main/getCurrentUrls'].public"
                append-outer-icon="mdi-content-copy"
                outlined
                dense
                readonly
                clearable
                label="Public URl"
                type="text"
                @click:append-outer="copyUrl('public')"
              ></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar app absolute flat color="transparent">
      <v-app-bar-nav-icon @click="toggleLeftSidebar()"></v-app-bar-nav-icon>
      <v-row justify="end" no-gutters>
        <v-col cols="8">
          <v-text-field
            solo
            label="Search"
            flat
            hide-details
            background-color="white"
            prepend-inner-icon="mdi-magnify"
            disabled
            v-model="searchText"
          ></v-text-field>
        </v-col>
      </v-row>
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
    leftSidebar: true,
    searchText: "",
    mainMenuItems: [
      { title: "My Files", icon: "mdi-folder", to: { name: "Browser" } },

      { title: "Help", icon: "mdi-help-box" },
    ],
  }),
  methods: {
    copyUrl(mode: string) {
      console.log("copy url");
      if (mode === "public") {
        console.log("copy public");
        navigator.clipboard.writeText(
          this.$store.getters["Main/getCurrentUrls"].public
        );
      } else {
        console.log("copy temporary");
        navigator.clipboard.writeText(
          this.$store.getters["Main/getCurrentUrls"].temporary
        );
      }
    },
    async signOut() {
      this.$store.dispatch("User/signOut");
    },
    toggleLeftSidebar() {
      this.leftSidebar = !this.leftSidebar;
    },
    closeRightSidebar() {
      this.$store.commit("Main/setRightSidebarState", false);
    },
  },
  watch: {
    searchText: function (newSearchText) {
      this.$store.commit("Storage/setSearchText", newSearchText);
    },
  },
  computed: {
    getSelectedFile() {
      const selectedFile = this.$store.getters["Main/getSelectedFile"];
      if (selectedFile) {
        return selectedFile;
      } else {
        return {};
      }
    },
  },
});
</script>
<style scoped>
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

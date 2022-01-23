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
                color="blue-grey lighten-2"
              >
                <v-list-item-icon class="ml-3">
                  <v-icon color="blue-grey darken-2">{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    class="
                      font-weight-medium
                      text-subtitle-2
                      blue-grey--text
                      text--darken-2
                    "
                    >{{ item.title }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <template v-slot:append>
        <v-sheet class="mx-3" rounded="lg">
          <v-container>
            <v-row justify="center">
              <v-col>
                <span class="grey--text text--darken-2 font-weight-medium">
                  <v-icon color="blue" class="mr-2 mb-2">mdi-cloud</v-icon>
                  Storage</span
                >
                <v-progress-linear
                  color="blue"
                  rounded
                  :value="$store.getters['Storage/getUsedPercentage']"
                  class="my-2"
                ></v-progress-linear>
                <span class="text-body-2 text-center grey--text text--darken-1"
                  >{{ $store.getters["Storage/getFormattedUsedStorage"] }} of
                  {{ $store.getters["Storage/getFormattedStorageLimit"] }}
                </span>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>

        <div class="pa-2 mt-4">
          <v-btn
            @click="signOut()"
            block
            depressed
            color="blue-grey darken-2"
            dark
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-navigation-drawer
      app
      floating
      right
      v-model="getRightSidebarState"
      disable-resize-watcher
    >
      <v-card flat tile>
        <v-card-title
          class="
            text-subtitle-1 text text-truncate
            blue-grey--text
            text--darken-2
            font-weight-medium
          "
        >
          Details
          <v-spacer></v-spacer>
          <v-btn small icon @click="closeRightSidebar()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-container class="mt-n4">
            <v-row>
              <v-col>
                <span class="text-subtitle-2 blue--text font-weight-medium"
                  >Name</span
                ><v-btn
                  icon
                  color="blue"
                  x-small
                  class="ml-2"
                  @click="setRenameMode(true)"
                  v-if="!renameMode"
                  :disabled="isFolder(getSelectedFile.__data.key)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="red"
                  x-small
                  class="ml-2"
                  @click="setRenameMode(false)"
                  v-if="renameMode"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="green"
                  x-small
                  class="ml-2"
                  @click="renameObject(getSelectedFile.__data.key)"
                  v-if="renameMode"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>

                <br />
                <span
                  class="text-subtitle-1 font-weight-bold"
                  v-if="!renameMode"
                >
                  {{ getSelectedFile.__data.key }}</span
                >
                <v-textarea
                  class="mt-3"
                  rows="1"
                  solo
                  outlined
                  flat
                  auto-grow
                  v-model="editedFileName"
                  v-if="renameMode"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <span
                  class="text-subtitle-2 blue--text font-weight-medium"
                  v-if="getPreviewUrl.category !== 'folder'"
                  >Public URL</span
                >
                <v-text-field
                  v-if="getPreviewUrl.category !== 'folder'"
                  :disabled="getSelectedFile.__data.key.slice(-1) === '/'"
                  :value="$store.getters['Main/getCurrentUrls'].public"
                  append-outer-icon="mdi-content-copy"
                  solo
                  background-color="blue-grey lighten-5"
                  flat
                  dense
                  readonly
                  hide-details=""
                  type="text"
                  @click:append-outer="copyUrl('public')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span
                  v-if="
                    getPreviewUrl.category === 'model' ||
                    getPreviewUrl.category === 'image'
                  "
                  class="text-subtitle-2 blue--text font-weight-medium"
                  >Preview</span
                >
                <v-sheet
                  outlined
                  rounded="lg"
                  class="pa-2 mt-2"
                  v-if="getPreviewUrl.category === 'image'"
                >
                  <v-img :src="getPreviewUrl.url" contain></v-img>
                </v-sheet>
                <v-sheet
                  outlined
                  rounded="lg"
                  class="pa-2 mt-2"
                  v-if="getPreviewUrl.category === 'model'"
                >
                  <div>
                    <model-viewer
                      camera-controls
                      loading="eager"
                      reveal="auto"
                      style="width: 180px; background-color: grey"
                      :src="getPreviewUrl.url"
                    ></model-viewer>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-app-bar app absolute flat color="transparent">
      <v-app-bar-nav-icon @click="toggleLeftSidebar()"></v-app-bar-nav-icon>
      <v-row justify="end" no-gutters>
        <v-col cols="5">
          <v-text-field
            solo
            label="Search"
            flat
            hide-details
            background-color="white"
            prepend-inner-icon="mdi-magnify"
            v-if="false"
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
import Auth from "@aws-amplify/auth";
export default Vue.extend({
  name: "Dashboard",
  data: () => ({
    renameMode: false,
    editedFileName: "",
    rightSidebar: true,
    leftSidebar: true,
    searchText: "",
    isMounted: false,
    mainMenuItems: [
      { title: "My Files", icon: "mdi-folder", to: { name: "Browser" } },

      { title: "Help", icon: "mdi-help-box", to: { name: "Help" } },
    ],
  }),
  methods: {
    isFolder(path: string) {
      return path.slice(-1) === "/";
    },
    getBasePath(fullPath: string) {
      let nameArray = fullPath.split("/");

      if (this.isFolder(fullPath)) {
        nameArray = nameArray.slice(0, nameArray.length - 2);
      }
      nameArray.pop();
      if (nameArray.length > 0) {
        return nameArray.join("/") + "/";
      } else {
        return "";
      }
    },
    setRenameMode(rename: boolean) {
      this.renameMode = rename;
      const selectedFile =
        this.$store.getters["Main/getSelectedFile"].__data.key;
      const nameArray = selectedFile.split("/");

      if (!this.isFolder(selectedFile)) {
        this.editedFileName = rename ? nameArray.pop() : "";
      } else {
        const folderName = nameArray[nameArray.length - 2];
        this.editedFileName = folderName;
      }
    },
    async renameObject(key: string) {
      console.log("Renaming object", key);
      const basePath = this.getBasePath(
        this.$store.getters["Main/getSelectedFile"].__data.key
      );
      let newKey = basePath + this.editedFileName;
      if (this.isFolder(key)) newKey = newKey + "/";

      await this.$store.dispatch("Storage/renameObject", {
        currentKey: key,
        newKey,
      });
      this.$store.dispatch(
        "Storage/fetchRemoteFileList",
        this.$store.getters["Storeage/getCurrentPath"]
      );
      this.renameMode = false;
    },
    copyUrl(mode: string) {
      if (mode === "public") {
        navigator.clipboard.writeText(
          this.$store.getters["Main/getCurrentUrls"].public
        );
      } else {
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
    getRightSidebarState: {
      get() {
        return this.$store.getters["Main/getRightSidebarState"];
      },
      set(value) {
        this.$store.commit("Main/setRightSidebarState", value);
      },
    },
    getSelectedFile() {
      const selectedFile = this.$store.getters["Main/getSelectedFile"];
      if (selectedFile) {
        return selectedFile;
      } else {
        return { __data: { key: "" } };
      }
    },

    getPreviewUrl() {
      const selectedFile = this.$store.getters["Main/getSelectedFile"];
      const urlObject = { category: "", url: "" };

      if (selectedFile) {
        const fileName = selectedFile.__data.key;
        const fileExt = fileName.split(".").pop();
        const isFolder = fileName.slice(-1) === "/";
        if (isFolder) {
          urlObject.category = "folder";
          return urlObject;
        }
        switch (fileExt) {
          case "jpg":
          case "png":
          case "gif":
            urlObject.category = "image";
            urlObject.url =
              this.$store.getters["Main/getCurrentUrls"].temporary;
            return urlObject;
          case "usdz":
          case "gltf":
          case "glb":
            urlObject.category = "model";
            urlObject.url =
              this.$store.getters["Main/getCurrentUrls"].temporary;
            return urlObject;
          default:
            return urlObject;
        }
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.isMounted = true;

    this.$store.dispatch("Storage/getStorageLimit");
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
  background-color: #eceff1 !important;
}
.round-border {
  border-radius: 100px !important;
}
</style>

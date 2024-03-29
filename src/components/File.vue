<template>
  <div>
    <v-dialog v-model="copyDialogState" width="400">
      <v-card loading="$store.getters['Storage/getFileCopyProgressState']">
        <v-card-title class="text-h6"> Copy File </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-sheet flat color="grey lighten-4" class="my-3 py-1" rounded="lg">
            <span class="text-subtitle-1 mx-6">
              {{ file.__data.key }}
            </span>
          </v-sheet>
          <v-sheet flat color="grey lighten-4" class="my-3 py-1" rounded="lg">
            <span class="text-subtitle-1 mx-6">
              {{ copyFileDestination }}
            </span>
          </v-sheet>

          <span>Choose destination folder</span>
          <v-sheet outlined class="overflow-auto mt-3" rounded="lg">
            <v-list dense>
              <v-list-item-group
                v-model="selectedFolder"
                @change="folderSelected()"
              >
                <v-list-item v-for="(item, i) in folderList" :key="i">
                  <v-list-item-icon>
                    <v-icon color="blue">mdi-folder</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.key"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-sheet>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="copyDialogState = false">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="performFileCopy()">
            Copy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-list-item
      @dblclick="handleFileDoubleClick(file.__data.key)"
      @click="setSelectedFile()"
      :ripple="false"
      @mouseover="hover(true)"
      @mouseleave="hover(false)"
    >
      <v-list-item-avatar size="20" tile>
        <v-icon class="" :color="getFileType(file.__data.key).color">
          {{ getFileType(file.__data.key).icon }}
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-row>
          <v-col cols="4" align-self="center"
            ><v-list-item-title
              class="
                text-subtitle-1
                font-weight-regular
                grey--text
                text--darken-2
              "
              >{{
                isFolder(file.__data.key)
                  ? file.__data.key.slice(0, -1).split("/").pop()
                  : file.__data.key.split("/").pop()
              }}</v-list-item-title
            ></v-col
          >
          <v-col cols="2" align-self="center"
            ><v-list-item-title class="grey--text text--darken-1">
              <v-chip
                v-if="filePublicStatus && !isFolder(file.__data.key)"
                small
                label
                :color="filePublicStatus.color"
                dark
              >
                {{ filePublicStatus.text }}
              </v-chip>
            </v-list-item-title>
          </v-col>
          <v-col cols="2" align-self="center"
            ><v-list-item-title class="grey--text text--darken-1"
              >{{ formatBytes(file.__data.size) }}
            </v-list-item-title>
          </v-col>
          <v-col cols="2" align-self="center"
            ><v-list-item-title class="grey--text text--darken-1"
              >{{ getFileType(file.__data.key).desc }}
            </v-list-item-title>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-row>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    v-show="fileHoverState"
                    :disabled="!isFolderEmpty(file)"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="(item, index) in contextMenuItems"
                    :key="index"
                    @click="handleFileActionClick(item.action, file.__data.key)"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { Storage } from "aws-amplify";
import awsconfig from "../aws-exports";

export default Vue.extend({
  name: "File",
  props: {
    file: Object,
  },
  data: () => ({
    fileHoverState: false,
    copyDialogState: false,
    selectedFolder: -1,
    copyFileSource: "",
    copyFileDestination: "",
    folderList: [] as any,
    fileTypes: {
      txt: {
        desc: "Text document",
        icon: "mdi-file-document-outline",
        action: "",
        color: "teal darken-1",
      },
      glb: {
        desc: "3D File",
        icon: "mdi-cube-scan",
        action: "",
        color: "red darken-1",
      },
      folder: {
        desc: "File folder",
        icon: "mdi-folder",
        color: "blue",
      },
      zip: {
        desc: "Compressed File",
        icon: "mdi-folder-zip",
        action: "",
        color: "amber accent-2",
      },
      generic: {
        desc: "File",
        icon: "mdi-file-outline",
        action: "",
        color: "grey",
      },
      pdf: {
        desc: "Adobe PDF",
        icon: "mdi-file-pdf-box",
        action: "",
        color: "red",
      },
      jpg: {
        desc: "JPEG Image",
        icon: "mdi-file-image-outline",
        action: "",
        color: "orange",
      },
      jpeg: {
        desc: "JPEG Image",
        icon: "mdi-file-image-outline",
        action: "",
        color: "orange",
      },
      png: {
        desc: "PNG Image",
        icon: "mdi-file-image-outline",
        action: "",
        color: "purple",
      },
    },
    contextMenuItems: [
      {
        text: "Delete",
        icon: "mdi-delete",
        action: "delete",
      },
      {
        text: "Download",
        icon: "mdi-cloud-download",
        action: "download",
      },
      {
        text: "Get Link",
        icon: "mdi-link-variant",
        action: "getlink",
      },
      {
        text: "Copy File",
        icon: "mdi-content-copy",
        action: "copyfile",
      },
    ],
    copyLinkDialog: false,
    copyLinkData: {},
    deleteDialog: false,
    deleteFileName: "",
    filePublicStatus: { text: "", color: "grey" },
  }),

  methods: {
    hover(state: boolean) {
      this.fileHoverState = state;
    },
    async setSelectedFile() {
      this.$store.commit("Main/setSelectedFile", this.file);
      this.$store.commit("Main/setRightSidebarState", true);

      this.$store.commit("Main/setCurrentUrls", await this.getPublicFileUrl());
    },
    isFolder(fileKey: string) {
      return fileKey.slice(-1) === "/";
    },
    isFolderEmpty(file: Record<string, any>) {
      const keys = Object.keys(file);
      if (keys.length === 1 && keys[0] === "__data") {
        return true;
      } else {
        return false;
      }
    },
    getFileType(filename: string) {
      var ext = filename.split(".").pop();
      var folderCheck = filename.slice(-1) === "/";
      if (folderCheck) return this.fileTypes.folder;
      let filetype = this.fileTypes.generic;
      switch (ext) {
        case "txt":
          filetype = this.fileTypes.txt;
          break;
        case "pdf":
          filetype = this.fileTypes.pdf;
          break;
        case "zip":
          filetype = this.fileTypes.zip;
          break;
        case "jpeg":
        case "jpg":
          filetype = this.fileTypes.jpg;
          break;
        case "gltf":
        case "glb":
          filetype = this.fileTypes.glb;
          break;
        case "png":
          filetype = this.fileTypes.png;
          break;
        default:
          filetype = this.fileTypes.generic;
      }
      return filetype;
    },
    formatBytes(bytes: number, decimals = 2) {
      if (bytes === 0) return "-";
      if (bytes === 1) return "-";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    handleFileDoubleClick(objectKey: string) {
      this.$emit("file-double-click", objectKey);
    },
    handleFileActionClick(action: string, filename: string) {
      switch (action) {
        case "delete":
          this.confirmDelete(filename);
          break;
        case "download":
          this.downloadFile(true, filename);
          break;
        case "getlink":
          this.downloadFile(false, filename);
          break;
        case "copyfile":
          this.copyFile();
          break;
      }
    },
    confirmDelete(filename: string) {
      // console.log("Deleting : " + filename);
      // this.deleteDialog = true;
      // this.deleteFileName = filename;
      this.$emit("delete-file", filename);
    },
    async copyFile() {
      console.log("copy file");
      this.copyDialogState = true;
    },
    async downloadFile(isDownload: boolean, fileName: string) {
      this.copyLinkData = {};
      const signedURL = await this.$store.dispatch("Storage/fetchFile", {
        isDownload,
        fileName,
      });
      if (isDownload) {
        window.open(signedURL, "_blank");
      } else {
        navigator.clipboard.writeText(signedURL);
        this.$emit("link-copied");
      }
    },
    async getPublicFileUrl() {
      const signedURL = await Storage.get(this.file.__data.key, {
        download: false,
        level: "private",
      });
      const publicUrl = signedURL.split("?")[0];
      return { temporary: signedURL, public: publicUrl };

      //console.log(publicUrl);
    },
    async getPublicAccessState() {
      const result = await this.getPublicFileUrl();
      try {
        const response = await fetch(result.public, { method: "HEAD" });
        if (response.ok) {
          this.filePublicStatus = { text: "public", color: "green" };
        } else if (response.status === 403) {
          this.filePublicStatus = { text: "private", color: "blue-grey" };
        }
      } catch (error: any) {
        // console.log("error", error.message);
      }
    },
    getFolderList() {
      const fileList = this.$store.getters["Storage/getRawFileList"];

      const folderList = fileList.filter((file: any) =>
        this.isFolder(file.key)
      );
      folderList.unshift({ key: "/" });

      return folderList;
    },
    folderSelected() {
      console.log(this.folderList[this.selectedFolder]);

      const selectedFolderPath = this.folderList[this.selectedFolder].key;
      this.copyFileSource = this.file.__data.key;
      const sourceFileName = this.file.__data.key.split("/").pop();
      if (selectedFolderPath === "/") {
        this.copyFileDestination = sourceFileName;
      } else {
        this.copyFileDestination = selectedFolderPath + sourceFileName;
      }
    },
    async performFileCopy() {
      if (this.copyFileSource && this.copyFileDestination) {
        await this.$store.dispatch("Storage/copyFile", {
          source: this.copyFileSource,
          destination: this.copyFileDestination,
        });
        this.copyDialogState = false;
      }
    },
  },

  mounted() {
    this.getPublicAccessState();
    this.folderList = this.getFolderList();
    //console.log("file", this.file);
  },
});
</script>

<template>
  <v-list-item
    @dblclick="handleFileDoubleClick(file.__data.key)"
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
          ><v-list-item-title class="grey--text text--darken-4">{{
            file.__data.key.slice(-1) === "/"
              ? file.__data.key.slice(0, -1).split("/").pop()
              : file.__data.key.split("/").pop()
          }}</v-list-item-title></v-col
        >
        <v-col cols="2" align-self="center"
          ><v-list-item-title class="grey--text text--darken-1">
            <v-chip
              v-if="filePublicStatus"
              small
              outlined
              :color="filePublicStatus.color"
              dark
              label
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
            <v-btn
              icon
              v-for="(contextItem, i) in contextMenuItems"
              :key="i"
              :disabled="file.__data.key.slice(-1) === '/'"
              v-show="fileHoverState"
              @click="
                handleFileActionClick(contextItem.action, file.__data.key)
              "
            >
              <v-icon dark>{{ contextItem.icon }}</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
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
      if (bytes === 0) return "0 Bytes";
      if (bytes === 1) return "-";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    handleFileDoubleClick(objectKey: string) {
      console.log("Double clicked on ", objectKey);
      this.$emit("file-double-click", objectKey);
    },
    handleFileActionClick(action: string, filename: string) {
      switch (action) {
        case "delete":
          this.confirmDelete(filename);
          break;
        case "download":
          this.DownloadFile(true, filename);
          break;
        case "getlink":
          this.DownloadFile(false, filename);
          break;
      }
    },
    confirmDelete(filename: string) {
      console.log("Deleting : " + filename);
      this.deleteDialog = true;
      this.deleteFileName = filename;
    },
    async DownloadFile(isDownload: boolean, fileName: string) {
      this.copyLinkData = {};
      const signedURL = await Storage.get(fileName, {
        download: false,
        progressCallback(progress) {
          // console.log(`Downloaded file ${fileName}: ${progress.loaded}/${progress.total}`);
        },
      });
      if (isDownload) {
        window.open(signedURL, "_blank");
      } else {
        this.copyLinkDialog = true;
        this.copyLinkData = {
          name: fileName,
          url: signedURL,
        };
      }
      console.log(signedURL);
    },
    async getPublicFileUrl() {
      const signedURL = await Storage.get(this.file.__data.key, {
        download: false,
      });
      const publicUrl = signedURL.split("?")[0];
      return publicUrl;
      //console.log(publicUrl);
    },
    async getPublicAccessState() {
      const result = await this.getPublicFileUrl();
      console.log(result);
      fetch(result, { method: "HEAD" }).then((res) => {
        if (res.ok) {
          this.filePublicStatus = { text: "public", color: "red" };
        } else if (res.status === 403) {
          this.filePublicStatus = { text: "private", color: "green" };
        }
      });
    },
  },
  mounted() {
    this.getPublicAccessState();
  },
});
</script>

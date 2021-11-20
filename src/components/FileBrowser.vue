<template>
  <div>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Confirm Delete? </v-card-title>
        <v-card-text>Delete {{ deleteFileName }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="RemoveRemoteFile(deleteFileName)"
          >
            confirm
          </v-btn>
          <v-btn color="green darken-1" text @click="deleteDialog = false">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="copyLinkDialog" persistent max-width="450">
      <v-card>
        <v-card-title class="text-h5"> Copy Link </v-card-title>
        <v-card-text
          >Link for file

          <a :href="copyLinkData.url">
            {{ copyLinkData.name }}
          </a>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="copyLinkDialog = false">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-toolbar flat dense>
      <v-btn icon color="grey" @click="navigateBack()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span>{{ getCurrentDirectory }}</span>

      <v-spacer></v-spacer>

      <v-btn class="mx-3" icon @click="listRemote()">
        <v-icon>mdi-refresh</v-icon></v-btn
      >

      <v-dialog v-model="newFolderDialog" width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            depressed
            color="blue"
            class="white--text mr-4"
            small
            outlined
          >
            <v-icon left class="mr-3">mdi-folder-plus</v-icon>New Folder</v-btn
          >
        </template>

        <v-card>
          <v-card-title class="text-h5">
            Create New Folder
            <v-spacer></v-spacer>
            <v-btn icon color="pink">
              <v-icon @click="newFolderDialog = false">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-container>
              <v-form
                ref="newfolderform"
                lazy-validation
                v-model="newFolderNameValid"
              >
                <v-text-field
                  v-model="newFolderName"
                  outlined
                  dense
                  class="mt-5"
                  :rules="folderNameRules"
                ></v-text-field>
              </v-form>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="validateNewFolderName()"
              :disabled="!newFolderNameValid"
            >
              Create Folder
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="uploadDialog" width="600" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            depressed
            color="blue"
            class="white--text"
            small
            outlined
          >
            <v-icon left class="mr-3">mdi-cloud-upload-outline</v-icon>Upload
            File</v-btn
          >
        </template>

        <v-card>
          <v-card-title class="text-h5">
            Upload Files
            <v-spacer></v-spacer>
            <v-btn icon color="pink">
              <v-icon @click="uploadDialog = false">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-file-input
              class="mt-8"
              v-model="fileList"
              label="Select Files"
              small-chips
              multiple
              clearable
              counter="25"
              show-size
              outlined
              dense
              :disabled="isUploading"
              hide-details="true"
            ></v-file-input>

            <v-container>
              <v-row
                v-for="(value, name) in fileUploadProgress"
                :key="name"
                no-gutters
              >
                <v-col>
                  <span> {{ value.filename }} </span>

                  <v-progress-linear
                    color="blue"
                    rounded
                    height="20"
                    :value="value.progress"
                  >
                    <template v-slot:default="{ value }">
                      <strong class="white--text text-body-4"
                        >{{ Math.ceil(value) }}%</strong
                      >
                    </template>
                  </v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="StartUpload()"
              text
              :disabled="isUploading || fileList.length === 0"
            >
              upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
    <v-toolbar flat dense height="30" color="grey lighten-3">
      <v-row>
        <v-col cols="6"
          ><v-list-item-title class="text-subtitle-2">
            File Name</v-list-item-title
          ></v-col
        >
        <v-col cols="2" class="ml-4"
          ><v-list-item-title class="text-subtitle-2">
            Last Modified</v-list-item-title
          >
        </v-col>
        <v-col cols="2"
          ><v-list-item-title class="text-subtitle-2"> Size </v-list-item-title>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-progress-linear
      color="blue lighten-1"
      indeterminate
      :active="isListLoading"
      height="4"
    ></v-progress-linear>
    <v-divider></v-divider>
    <v-list dense class="mt-n2">
      <v-list-item-group v-model="selectedFile" color="primary" multiple>
        <template v-for="(item, i) in getFilesAtPath">
          <v-list-item
            :key="i"
            @dblclick="HandleFileDoubleClick(item.__data.key)"
            :ripple="false"
          >
            <v-list-item-avatar size="20" tile>
              <v-icon class="" :color="getFileType(item.__data.key).color">
                {{ getFileType(item.__data.key).icon }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-row>
                <v-col cols="6" align-self="center"
                  ><v-list-item-title class="grey--text text--darken-3">{{
                    item.__data.key.slice(-1) === "/"
                      ? item.__data.key.slice(0, -1).split("/").pop()
                      : item.__data.key.split("/").pop()
                  }}</v-list-item-title></v-col
                >
                <v-col cols="2" align-self="center"
                  ><v-list-item-title class="grey--text text--darken-1">{{
                    new Date(item.__data.lastModified).toLocaleString()
                  }}</v-list-item-title>
                </v-col>
                <v-col cols="2" align-self="center"
                  ><v-list-item-title class="grey--text text--darken-1"
                    >{{ formatBytes(item.__data.size) }}
                  </v-list-item-title>
                </v-col>
                <v-col cols="2" align-self="center">
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-menu bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" class="mx-4">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-card class="mx-auto" max-width="300" tile>
                        <v-list dense nav>
                          <v-list-item-group color="primary">
                            <v-list-item
                              :disabled="item.__data.key.slice(-1) === '/'"
                              v-for="(contextItem, i) in contextMenuItems"
                              :key="i"
                              @click="
                                HandleContextClick(
                                  contextItem.action,
                                  item.__data.key
                                )
                              "
                            >
                              <v-list-item-icon>
                                <v-icon v-text="contextItem.icon"></v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="contextItem.text"
                                ></v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-row>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="i + 'div'"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import {
  S3ProviderListOutput,
  S3ProviderListOutputItem,
} from "@aws-amplify/storage/";
import { Storage } from "aws-amplify";
import Vue, { PropType } from "vue";
export default Vue.extend({
  name: "FileBrowser",
  props: {
    initPath: {
      type: String,
      default: "",
    },
    pathExcludes: {
      type: Array as PropType<string[]>,
      default: () => {
        return [] as string[];
      },
    },
  },
  data: () => ({
    copyLinkDialog: false,
    copyLinkData: {},
    deleteDialog: false,
    deleteFileName: "",
    uploadDialog: false,
    newFolderDialog: false,
    newFolderName: "",
    fileList: [],
    isUploading: false,
    isListLoading: false,
    fileUploadProgress: {} as Record<string, any>,
    selectedFile: [],
    currentPath: "",
    navigationHistory: [] as string[],
    remoteFileList: {} as Record<string, any>,
    newFolderNameValid: true,
    folderNameRules: [
      (v: string) => !!v || "Folder name is required",
      (v: string) =>
        /^[a-zA-Z0-9_-]*$/.test(v) ||
        "Folder Name can only  have alpha numeric characters and underscores",
      //(v) => (v && v.length >= 6) || "Password must be greater than 6 characters",
    ],
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
    fileTypes: {
      txt: {
        desc: "Text document",
        icon: "mdi-file-document-outline",
        action: "",
        color: "teal darken-1",
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
  }),
  methods: {
    validateNewFolderName() {
      if (
        (
          this.$refs.newfolderform as Vue & { validate: () => boolean }
        ).validate()
      ) {
        console.log("Validation passed for create folder");
        this.CreateNewFolder();
      }
    },
    GoBack() {
      this.$router.back();
    },
    refreshFileList() {
      this.listRemote(this.currentPath);
    },
    async CreateNewFolder() {
      if (this.newFolderName === "") return;
      let folderName = this.currentPath + this.newFolderName + "/";
      console.log(folderName);
      const result = await Storage.put(folderName, " ");
      this.newFolderName = "";
      this.newFolderDialog = false;
      this.listRemote(this.initPath);
      console.log(result);
    },
    async StartUpload() {
      if (this.fileList.length === 0) return;
      this.isUploading = true;
      this.fileList.forEach((fileobj) => {
        this.UploadSingleFile(fileobj);
      });
      console.log("upload finished");
    },
    async UploadSingleFile(file: File) {
      let fullFileName = this.currentPath + file.name;
      console.log("Uploading to:" + fullFileName);
      var id = fullFileName; //uuidv4();
      // this.fileUploadProgress[id] = {
      //   filename: file.name,
      //   progress:0,
      // };
      Vue.set(this.fileUploadProgress, id, {
        filename: file.name,
        progress: 0,
      });
      console.log("filename :" + file.name);
      if (file === null) return;
      try {
        const result = await Storage.put(fullFileName, file, {
          progressCallback: (progress) => {
            this.fileUploadProgress[id].progress =
              (progress.loaded / progress.total) * 100;
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        });
        console.log(result);
        Vue.delete(this.fileUploadProgress, result.key);
        if (
          Object.keys(this.fileUploadProgress).length === 0 &&
          this.fileUploadProgress.constructor === Object
        ) {
          console.log("File downloadin completed");
          this.fileList = [];
          this.isUploading = false;
          this.uploadDialog = false;
          this.listRemote(this.initPath);
        }
        //check results with file id
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    },
    listRemote(path = "") {
      this.isListLoading = true;
      Storage.list(path) // for listing ALL files without prefix, pass '' instead
        .then((result) => {
          console.log(result);
          this.remoteFileList = this.processStorageList(result);
          console.warn(this.remoteFileList);
          this.currentPath = this.initPath;
          this.isListLoading = false;
        })
        .catch((err) => console.log(err));
    },
    processStorageList(results: S3ProviderListOutput) {
      const filesystem: Record<string, any> = {};
      // https://stackoverflow.com/questions/44759750/how-can-i-create-a-nested-object-representation-of-a-folder-structure
      const add = (
        source: string,
        target: Record<string, any>,
        item: S3ProviderListOutputItem
      ) => {
        const elements = source.split("/");
        const element = elements.shift();
        if (!element) return; // blank
        target[element] = target[element] || { __data: item }; // element;
        if (elements.length) {
          target[element] =
            typeof target[element] === "object" ? target[element] : {};
          add(elements.join("/"), target[element], item);
        }
      };
      results.forEach((item) => {
        if (item.key) add(item.key, filesystem, item);
      });
      this.pathExcludes.forEach((excludedPath) => {
        if (excludedPath !== "") {
          delete filesystem[excludedPath];
        }
      });
      return filesystem;
    },
    formatBytes(bytes: number, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
        case "png":
          filetype = this.fileTypes.png;
          break;
        default:
          filetype = this.fileTypes.generic;
      }
      return filetype;
    },
    HandleFileDoubleClick(objectKey: string) {
      if (objectKey.slice(-1) === "/") {
        //its a folder so change to that path
        this.navigationHistory.push(this.currentPath);
        console.warn(this.navigationHistory);
        this.currentPath = objectKey;
      }
    },
    HandleContextClick(action: string, filename: string) {
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
    navigateBack() {
      if (this.navigationHistory.length > 0) {
        const path = this.navigationHistory.pop();
        if (path || path === "") this.currentPath = path;
        console.warn(this.navigationHistory);
      }
    },
    confirmDelete(filename: string) {
      console.log("Deleting : " + filename);
      this.deleteDialog = true;
      this.deleteFileName = filename;
    },
    async RemoveRemoteFile(fileName: string) {
      let fullFileName = fileName;
      console.log("Full file name :" + fullFileName);
      var result = await Storage.remove(fullFileName);
      this.deleteFileName = "";
      this.deleteDialog = false;
      console.log(result);
      this.listRemote(this.initPath);
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
  },
  computed: {
    getFilesAtPath() {
      console.log("Getting files in path:", this.currentPath);
      if (this.currentPath === "") {
        return this.remoteFileList;
      } else {
        var pathVars = this.currentPath.split("/");
        var currentPathObj = this.remoteFileList;
        for (let index = 0; index < pathVars.length; index++) {
          if (pathVars[index] !== "") {
            currentPathObj = currentPathObj[pathVars[index]];
          }
        }
        console.log("current path object");
        console.log(currentPathObj);
        let objCopy = Object.assign({}, currentPathObj);
        delete objCopy.__data;
        return objCopy;
      }
    },
    getPathNavigators() {
      if (this.currentPath === "") {
        return [{ name: "Public", path: "" }];
      } else {
        var pathVars = this.currentPath.split("/");
        console.log(pathVars);
        var pathArray: Record<string, string>[] = [];
        var tempPath = "";
        pathVars.forEach((path) => {
          if (path !== "") {
            tempPath = tempPath + "/" + path;
            pathArray.push({ name: path, path: tempPath });
          }
        });
        console.log(pathArray);
        return pathArray;
      }
    },
    getCurrentDirectory() {
      if (this.currentPath === "") {
        return "Home";
      } else {
        var pathVars = this.currentPath.split("/");
        var filtered = pathVars.filter((dir) => {
          return dir !== "";
        });
        console.log(filtered);
        if (this.navigationHistory.length === 0) {
          return "Home";
        } else {
          return filtered[filtered.length - 1];
        }
      }
    },
  },
  mounted() {
    this.listRemote(this.initPath);
    console.log("Init Path :" + this.initPath);
    document.addEventListener(
      "drag",
      function (event) {
        console.log(event);
      },
      false
    );
  },
});
</script>

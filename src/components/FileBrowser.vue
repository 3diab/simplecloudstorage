<template>
  <div>
    <v-dialog v-model="deleteDialog" persistent width="300">
      <v-card>
        <v-card-title class="text-subtitle-1"> Confirm Delete? </v-card-title>
        <v-card-text>
          <span class="font-weight-medium">{{ deleteFileName }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteDialog = false">
            cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="RemoveRemoteFile(deleteFileName)"
          >
            confirm
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
    <v-snackbar v-model="linkCopiedSnackbar" timeout="1500" top centered app>
      <v-icon>mdi-content-copy</v-icon> Temporary link copied to clipboard
    </v-snackbar>

    <v-toolbar rounded="lg" flat>
      <v-btn icon color="grey" @click="navigateBack()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span>{{ getCurrentDirectory }}</span>

      <v-spacer></v-spacer>
      <v-btn @click="onGenerateManifestAction">Generate Manifest</v-btn>

      <v-btn class="mx-3" icon @click="listRemote()">
        <v-icon>mdi-refresh</v-icon></v-btn
      >

      <v-dialog v-model="newFolderDialog" width="400" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            depressed
            color="blue "
            class="white--text"
            large
            icon
          >
            <v-icon>mdi-folder-plus</v-icon></v-btn
          >
        </template>

        <v-card>
          <v-card-title class="text-h6">
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
            color="blue "
            class="white--text mr-5"
            icon
            large
          >
            <v-icon>mdi-cloud-upload</v-icon></v-btn
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
            <span
              v-if="getUploadValidity.valid"
              class="blue-grey--text text--darken-2 text-subtitle-2"
              >Available:
              <span class="font-weight-bold text-subtitle-2">
                {{ getUploadValidity.storageLeft }}</span
              ></span
            >
            <span
              v-if="!getUploadValidity.valid"
              class="red--text text--darken-2 text-subtitle-2"
              >Storage Limit Exceeded</span
            >
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="StartUpload()"
              text
              :disabled="
                isUploading || fileList.length === 0 || !getUploadValidity.valid
              "
            >
              upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-toolbar flat dense height="50" color="white" class="my-3" rounded="lg">
      <v-row>
        <v-col cols="4"
          ><v-list-item-title
            class="text-subtitle-2 blue-grey--text text--darken-2"
          >
            File Name</v-list-item-title
          ></v-col
        >
        <v-col cols="2" class="ml-4"
          ><v-list-item-title
            class="text-subtitle-2 blue-grey--text text--darken-2"
          >
            Access</v-list-item-title
          >
        </v-col>
        <v-col cols="2"
          ><v-list-item-title
            class="text-subtitle-2 blue-grey--text text--darken-2"
          >
            Size
          </v-list-item-title>
        </v-col>
        <v-col cols="2"
          ><v-list-item-title
            class="text-subtitle-2 blue-grey--text text--darken-2"
          >
            Type
          </v-list-item-title>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-card rounded="lg" flat class="my-3">
      <v-card-title class="mb-n5"> </v-card-title>

      <v-progress-linear
        color="blue lighten-1"
        indeterminate
        :active="isListLoading"
        height="4"
      ></v-progress-linear>

      <v-list class="mt-n2">
        <v-alert
          dense
          type="info"
          outlined
          class="mt-3 mx-5"
          text
          v-if="Object.keys(getFilesAtPath).length === 0"
        >
          Seems like you don't have any Files.Start uploading now!
        </v-alert>
        <v-list-item-group
          v-model="selectedFile"
          color="grey "
          :multiple="getMultipleState"
        >
          <template v-for="(file, i, index) in getFilesAtPath">
            <file
              :key="i"
              :file="file"
              v-on:file-double-click="handleFileDoubleClick"
              v-on:delete-file="confirmDelete"
              v-on:link-copied="showLinkSnackbar"
            ></file>
            <v-divider
              v-if="index != Object.keys(getFilesAtPath).length - 1"
              :key="i + 'div'"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  S3ProviderListOutput,
  S3ProviderListOutputItem,
} from "@aws-amplify/storage/";
import { Storage } from "aws-amplify";
import Vue, { PropType } from "vue";
import File from "../components/File.vue";
export default Vue.extend({
  name: "FileBrowser",
  components: {
    File,
  },
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
    linkCopiedSnackbar: false,
    isFileUploadPrivate: false,
    ctrlPressed: false,
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
    usedStorage: 0,
    isStorageLimitChecked: false,
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
  watch: {
    selectedFile: function (newValue) {
      // console.log("Setting", newValue);
      // if (typeof newValue === "number") {
      //   this.$store.commit("Main/setSelectedFile", newValue);
      //   this.$store.commit("Main/setRightSidebarState", true);
      // } else {
      //   this.$store.commit("Main/setSelectedFile", {});
      //   this.$store.commit("Main/setRightSidebarState", false);
      // }
    },
  },
  methods: {
    async onGenerateManifestAction() {
      console.log("Generatin manifest from button action");
      this.$store.dispatch("Storage/generateManifest", this.currentPath);
      // const files = await Storage.list(this.currentPath, { level: "private" });
      // const basePath = this.currentPath;
      // const rootFiles = files.filter((fileObj) => {
      //   const expression = new RegExp("^" + basePath);

      //   const filePath = fileObj.key?.replace(expression, "");
      //   const fileObjParts = filePath?.split("/");
      //   const partLength = fileObjParts?.length;
      //   return partLength === 1 || fileObjParts!.pop() === "";
      // });

      // const manifestData = {
      //   files: [] as any,
      // };
      // // Check if root or else skip

      // for (let i = 0; i < rootFiles.length; i++) {
      //   const fileObj = rootFiles[i];
      //   const { key, size, lastModified } = fileObj;
      //   const urls = (await this.$store.dispatch(
      //     "Storage/getPublicFileUrl",
      //     key
      //   )) as Promise<{ public: string; temporary: string }>;
      //   //promises.push(urls);

      //   manifestData.files.push({
      //     path: (await urls).public,
      //     size,
      //     lastModified,
      //   });
      // }

      // //await Promise.all(promises);

      // console.log(JSON.stringify(manifestData));
    },
    showLinkSnackbar() {
      this.linkCopiedSnackbar = true;
    },
    validateNewFolderName() {
      if (
        (
          this.$refs.newfolderform as Vue & { validate: () => boolean }
        ).validate()
      ) {
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
      const result = await Storage.put(folderName, "", { level: "private" });
      this.newFolderName = "";
      this.newFolderDialog = false;
      this.listRemote(this.initPath);
    },
    async StartUpload() {
      if (this.fileList.length === 0) return;
      this.isUploading = true;
      this.fileList.forEach((fileobj) => {
        this.UploadSingleFile(fileobj);
      });
    },
    async UploadSingleFile(file: File) {
      let fullFileName = this.currentPath + file.name;

      var id = fullFileName; //uuidv4();
      // this.fileUploadProgress[id] = {
      //   filename: file.name,
      //   progress:0,
      // };
      Vue.set(this.fileUploadProgress, id, {
        filename: file.name,
        progress: 0,
      });
      // console.log("filename :" + file.name);
      if (file === null) return;
      try {
        const result = await Storage.put(fullFileName, file, {
          level: "private",
          acl: "public-read",

          progressCallback: (progress) => {
            this.fileUploadProgress[id].progress =
              (progress.loaded / progress.total) * 100;
          },
        });

        Vue.delete(this.fileUploadProgress, result.key);
        if (
          Object.keys(this.fileUploadProgress).length === 0 &&
          this.fileUploadProgress.constructor === Object
        ) {
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
      Storage.list(path, { level: "private" }) // for listing ALL files without prefix, pass '' instead
        .then((result) => {
          // console.log(result);
          this.remoteFileList = this.processStorageList(result);
          this.getStorageUsage(result);
          //console.warn(this.remoteFileList);
          this.currentPath = this.initPath;
          this.isListLoading = false;
        })
        .catch((err) => console.log(err));
    },
    getStorageUsage(fileList: Record<string, any>) {
      let usedStorage = 0;

      fileList.forEach((file: Record<string, any>) => {
        usedStorage += +file.size;
      });

      this.usedStorage = usedStorage;
      this.$store.commit("Storage/setUsedStorage", usedStorage);
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
    handleFileDoubleClick(objectKey: string) {
      if (objectKey.slice(-1) === "/") {
        //its a folder so change to that path
        this.navigationHistory.push(this.currentPath);

        this.currentPath = objectKey;
      }
    },

    navigateBack() {
      if (this.navigationHistory.length > 0) {
        const path = this.navigationHistory.pop();
        if (path || path === "") this.currentPath = path;
      }
    },
    confirmDelete(filename: string) {
      this.deleteDialog = true;
      this.deleteFileName = filename;
    },
    async RemoveRemoteFile(fileName: string) {
      let fullFileName = fileName;

      var result = await Storage.remove(fullFileName, { level: "private" });
      this.deleteFileName = "";
      this.deleteDialog = false;

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
    },
  },
  computed: {
    getMultipleState() {
      return this.ctrlPressed;
    },
    getUploadValidity() {
      let totalUploadSize = 0;

      this.fileList.forEach((file: File) => {
        totalUploadSize += file.size;
      });
      const storageLeft =
        this.$store.getters["Storage/getStorageLimit"] -
        this.$store.getters["Storage/getUsedStorage"];
      const storageAfterUpload = storageLeft - totalUploadSize;
      const left = `${Math.floor(storageAfterUpload / (1024 * 1024))} MB`;
      const validity = {
        valid: false,
        storageLeft: left,
      };
      if (storageAfterUpload < 0) {
        return validity;
      } else {
        return {
          valid: true,
          storageLeft: left,
        };
      }
    },

    getFilesAtPath() {
      const searchText = this.$store.getters["Storage/getSearchText"].trim();
      // if (searchText === "") {
      //   let counter = 0;

      //   let deepIterator = (target: Record<string, any>) => {
      //     counter++;
      //     console.log(target);
      //     if (typeof target === "object") {
      //       for (const key in target) {
      //         deepIterator(target[key]);
      //       }
      //     } else {
      //       console.log(target);
      //     }
      //   };
      //   deepIterator(this.remoteFileList);
      //   console.log(searchText);
      // }
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

        var pathArray: Record<string, string>[] = [];
        var tempPath = "";
        pathVars.forEach((path) => {
          if (path !== "") {
            tempPath = tempPath + "/" + path;
            pathArray.push({ name: path, path: tempPath });
          }
        });

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

    document.addEventListener(
      "drag",
      function (event) {
        console.log(event);
      },
      false
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Control" || e.key === "Meta") {
        this.ctrlPressed = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Control" || e.key === "Meta") {
        this.ctrlPressed = false;
      }
    });
  },
});
</script>

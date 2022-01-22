import { ActionTree, GetterTree, MutationTree } from "vuex";
import { Storage as LibStorage } from "aws-amplify";
import {
  S3ProviderListOutput,
  S3ProviderListOutputItem,
} from "@aws-amplify/storage/";
type State = {
  searchText: string;
  usedStorage: number;
  isStorageLimitChecked: boolean;
  storageLimit: number;
  currentPath: string;
  isFileListLoading: boolean;
  rawFileList: Record<string, any>;
  processedFileList: Record<string, any>;
};
const state: State = {
  searchText: "",
  usedStorage: 0,
  storageLimit: 1024 * 1024 * 1024,
  isStorageLimitChecked: false,
  currentPath: "",
  isFileListLoading: false,
  processedFileList: {},
  rawFileList: {},
};

const actions: ActionTree<State, unknown> = {
  async createNewFolder({ state }, newFolderName) {
    await LibStorage.put(newFolderName, "", { level: "private" });
  },
  async fetchRemoteFileList({ commit, dispatch }, path = "") {
    commit("setIsFileListLoadingState", true);
    try {
      const result = await LibStorage.list(path, { level: "private" });
      commit("setRawFileList", result);
      const processedFileList = processStorageList(result);
      commit("setProcessedFileList", processedFileList);

      await dispatch("getStorageUsage", result);
      commit("setCurrentPath", path);
      commit("setIsFileListLoadingState", false);
    } catch (error) {
      console.log(error);
    }
  },
  getStorageUsage({ state, commit }, fileList: Record<string, any>) {
    let usedStorage = 0;

    fileList.forEach((file: Record<string, any>) => {
      usedStorage += +file.size;
    });

    state.usedStorage = usedStorage;
    commit("setUsedStorage", usedStorage);
  },
  getStorageLimit({ commit, rootGetters }) {
    const groups = rootGetters["User/getUserGroups"];
    groups.forEach((group: string) => {
      if (group.includes("__storage__")) {
        const limitString = group.split("__").pop();

        const totalLimit = (limitString: string) => {
          let limit = 1;
          limitString.split("*").forEach((section: string) => {
            limit *= +section;
          });
          return limit;
        };
        if (limitString) {
          const limit = totalLimit(limitString);
          commit("setStorageLimit", limit);
        }
      }
    });
  },
  async getPublicFileUrl({ commit }, fileName: string) {
    const signedURL = await LibStorage.get(fileName, {
      download: false,
      level: "private",
    });
    const publicUrl = signedURL.split("?")[0];
    return { temporary: signedURL, public: publicUrl };

    //console.log(publicUrl);
  },
  async generateManifest({ dispatch }, currentPath: string) {
    const files = await LibStorage.list(currentPath, { level: "private" });
    const basePath = currentPath;
    const rootFiles = files.filter((fileObj) => {
      const expression = new RegExp("^" + basePath);

      const filePath = fileObj.key?.replace(expression, "");
      const fileObjParts = filePath?.split("/");
      const partLength = fileObjParts?.length;
      return partLength === 1 || fileObjParts!.pop() === "";
    });

    const manifestData = {
      files: [] as any,
    };
    // Check if root or else skip

    for (let i = 0; i < rootFiles.length; i++) {
      const fileObj = rootFiles[i];
      const { key, size, lastModified } = fileObj;
      const urls = (await dispatch("getPublicFileUrl")) as Promise<{
        public: string;
        temporary: string;
      }>;
      //promises.push(urls);

      manifestData.files.push({
        path: (await urls).public,
        size,
        lastModified,
      });
    }

    // Write manifest to current folder
    const manifestUrl = currentPath + "manifest.json";
    await LibStorage.put(manifestUrl, manifestData, {
      level: "private",
      contentType: "application/json",
    });

    console.log(JSON.stringify(manifestData));
  },
  async renameObject(
    { commit },
    payload: { currentKey: string; newKey: string }
  ) {
    const { currentKey, newKey } = payload;
    try {
      const copyResponse = await LibStorage.copy(
        { key: currentKey, level: "private" },
        { key: newKey, level: "private" },
        { acl: "public-read" }
      );
      const deleteResponse = await LibStorage.remove(currentKey, {
        level: "private",
      });
      console.log("Rename Operation :", copyResponse, deleteResponse);
    } catch (error) {
      console.log(error);
    }
  },
  async deleteRemoteFile({ dispatch, state }, filePath: string) {
    try {
      await LibStorage.remove(filePath, { level: "private" });
    } catch (error) {
      console.log(error);
    }
  },
  async fetchFile(
    { commit },
    payload: { isDownload: boolean; fileName: string }
  ) {
    const { isDownload, fileName } = payload;

    try {
      const signedURL = await LibStorage.get(fileName, {
        download: false,
        level: "private",
      });
      return signedURL;
    } catch (error) {
      console.log(error);
    }
  },
};

const mutations: MutationTree<State> = {
  setProcessedFileList(state, fileList: Record<string, any>) {
    state.processedFileList = fileList;
  },
  setRawFileList(state, fileList: Record<string, any>) {
    state.rawFileList = fileList;
  },
  setCurrentPath(state, path: string) {
    state.currentPath = path;
  },
  setSearchText(state, searchText) {
    state.searchText = searchText;
  },
  setStorageLimit(state, limit) {
    state.storageLimit = limit;
  },
  setUsedStorage(state, usedStorage: number) {
    state.usedStorage = usedStorage;
  },
  setIsStorageLimitChecked(state, storageState: boolean) {
    state.isStorageLimitChecked = storageState;
  },
  setIsFileListLoadingState(state, loadingState: boolean) {
    state.isFileListLoading = loadingState;
  },
};
const getters: GetterTree<State, unknown> = {
  getCurrentPath: (state) => {
    return state.currentPath;
  },
  getSearchText: (state) => {
    return state.searchText;
  },
  getUsedStorage: (state) => {
    return state.usedStorage;
  },
  getStorageLimit: (state) => {
    return state.storageLimit;
  },
  getIsStorageLimitChecked: (state) => {
    return state.isStorageLimitChecked;
  },
  getFormattedStorageLimit: (state) => {
    return formatBytes(state.storageLimit);
  },
  getFormattedUsedStorage: (state) => {
    return formatBytes(state.usedStorage);
  },
  getUsedPercentage: (state) => {
    return (state.usedStorage / state.storageLimit) * 100;
  },
  getProcessedFileList: (state) => {
    return state.processedFileList;
  },
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
const processStorageList = (results: S3ProviderListOutput) => {
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

  return filesystem;
};

const Storage = { namespaced: true, state, actions, mutations, getters };

export default Storage;

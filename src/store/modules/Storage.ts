import { ActionTree, GetterTree, MutationTree } from "vuex";
import { Storage as LibStorage } from "aws-amplify";
type State = {
  searchText: string;
  usedStorage: number;
  isStorageLimitChecked: boolean;
  storageLimit: number;
};
const state: State = {
  searchText: "",
  usedStorage: 0,
  storageLimit: 1024 * 1024 * 1024,
  isStorageLimitChecked: false,
};

const actions: ActionTree<State, unknown> = {
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
};

const mutations: MutationTree<State> = {
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
};
const getters: GetterTree<State, unknown> = {
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
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const Storage = { namespaced: true, state, actions, mutations, getters };

export default Storage;

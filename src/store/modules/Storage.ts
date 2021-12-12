import { ActionTree, GetterTree, MutationTree } from "vuex";

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

import { ActionTree, GetterTree, MutationTree } from "vuex";

type State = {
  rightSidebarState: boolean;
  selectedFile: Record<string, any>;
  currentUrls: { temporary: string; public: string };
};
const state: State = {
  rightSidebarState: false,
  selectedFile: {},
  currentUrls: { temporary: "", public: "" },
};

const actions: ActionTree<State, unknown> = {};

const mutations: MutationTree<State> = {
  setRightSidebarState(state, sidebarState) {
    state.rightSidebarState = sidebarState;
  },
  setSelectedFile(state, file) {
    state.selectedFile = file;
  },
  setCurrentUrls(state, urls) {
    state.currentUrls = urls;
  },
};
const getters: GetterTree<State, unknown> = {
  getRightSidebarState: (state) => {
    return state.rightSidebarState;
  },
  getSelectedFile: (state) => {
    return state.selectedFile;
  },
  getCurrentUrls: (state) => {
    return state.currentUrls;
  },
};

const Main = { namespaced: true, state, actions, mutations, getters };

export default Main;

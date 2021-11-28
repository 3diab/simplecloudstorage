import { ActionTree, GetterTree, MutationTree } from "vuex";

type State = {
  rightSidebarState: boolean;
};
const state: State = {
  rightSidebarState: false,
};

const actions: ActionTree<State, unknown> = {};

const mutations: MutationTree<State> = {
  setRightSidebarState(state, sidebarState) {
    state.rightSidebarState = sidebarState;
  },
};
const getters: GetterTree<State, unknown> = {
  getRightSidebarState: (state) => {
    return state.rightSidebarState;
  },
};

const Storage = { namespaced: true, state, actions, mutations, getters };

export default Storage;

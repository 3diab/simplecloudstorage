import { ActionTree, GetterTree, MutationTree } from "vuex";

type State = {
  searchText: string;
};
const state: State = {
  searchText: "",
};

const actions: ActionTree<State, unknown> = {};

const mutations: MutationTree<State> = {
  setSearchText(state, searchText) {
    state.searchText = searchText;
  },
};
const getters: GetterTree<State, unknown> = {
  getSearchText: (state) => {
    return state.searchText;
  },
};

const Storage = { namespaced: true, state, actions, mutations, getters };

export default Storage;

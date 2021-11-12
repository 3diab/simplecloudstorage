import Auth from "@aws-amplify/auth";
import { CognitoUserInterface } from "@aws-amplify/ui-components";
import { ActionTree, GetterTree, MutationTree } from "vuex";

type State = {
  authenticatedUser: CognitoUserInterface | null;
};
const state: State = {
  authenticatedUser: null,
};

const actions: ActionTree<State, unknown> = {
  async signIn({ commit }, payload) {
    try {
      const user = await Auth.signIn(payload.username, payload.password);
      commit("setUser", user);
    } catch (error) {
      console.log("error signing in", error);
    }
  },
};

const mutations: MutationTree<State> = {
  setUser(state, user: CognitoUserInterface) {
    state.authenticatedUser = user;
  },
};
const getters: GetterTree<State, unknown> = {};

const User = { namespaced: true, state, actions, mutations, getters };

export default User;

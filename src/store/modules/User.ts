import Auth from "@aws-amplify/auth";
import router from "../../router";
import { CognitoUserInterface } from "@aws-amplify/ui-components";
import { ActionTree, GetterTree, MutationTree } from "vuex";
type AuthError = { error: boolean; errorMessage: string };
type State = {
  authenticatedUser: CognitoUserInterface | null;
  loginProgress: boolean;
  confirmSignUp: boolean;
  signUpError: AuthError;
  signInError: AuthError;
};
const state: State = {
  authenticatedUser: null,
  loginProgress: false,
  confirmSignUp: false,
  signInError: { error: false, errorMessage: "" },
  signUpError: { error: false, errorMessage: "" },
};

const actions: ActionTree<State, unknown> = {
  async signIn({ commit }, payload) {
    commit("setSignInError", { error: false, errorMessage: "" });

    try {
      commit("setLoginProgressState", true);
      const user = await Auth.signIn(payload.username, payload.password);
      console.log(user);
      commit("setUser", user);
      commit("setLoginProgressState", false);
      router.replace({ name: "Dashboard" });
    } catch (error: any) {
      commit("setLoginProgressState", false);

      commit("setSignInError", { error: true, errorMessage: error.message });
      console.log("error signing in", Object.keys(error));
    }
  },
  async signOut({ commit }) {
    await Auth.signOut();
    router.replace({ name: "Login" });
  },
  async signUp(
    { commit },
    payload: {
      username: string;
      password: string;
      email: string;
      preferred_username: string;
    }
  ) {
    commit("setSignUpError", { error: false, errorMessage: "" });
    try {
      commit("setLoginProgressState", true);

      const { user } = await Auth.signUp({
        username: payload.username,
        password: payload.password,
        attributes: {
          email: payload.email, // optional
          preferred_username: payload.preferred_username,
        },
      });
      console.log(user);
      //confirm user
      commit("setConfirmSignUpState", true);
      commit("setLoginProgressState", false);
    } catch (error) {
      commit("setSignUpError", { error: true, errorMessage: error });
      commit("setLoginProgressState", false);
    }
  },
  async confirmSignUp({ commit }, payload: { username: string; code: string }) {
    console.log("Confirming :", payload);
    try {
      const user = await Auth.confirmSignUp(payload.username, payload.code);
      console.log(user);

      commit("setConfirmSignUpState", true);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  },
};

const mutations: MutationTree<State> = {
  setUser(state, user: CognitoUserInterface) {
    state.authenticatedUser = user;
  },
  setLoginProgressState(state, progressState: boolean) {
    state.loginProgress = progressState;
  },
  setConfirmSignUpState(state, confirmState: boolean) {
    state.confirmSignUp = confirmState;
  },
  setSignInError(state, error: AuthError) {
    state.signInError = error;
  },
  setSignUpError(state, error: AuthError) {
    state.signUpError = error;
  },
};
const getters: GetterTree<State, unknown> = {
  getLoginProgressState: (state) => {
    return state.loginProgress;
  },
  setConfirmSignUpState: (state) => {
    return state.confirmSignUp;
  },
  getUser: (state) => {
    return state.authenticatedUser;
  },

  getSignInError: (state) => {
    return state.signInError;
  },
  getSignUpError: (state) => {
    return state.signUpError;
  },
};

const User = { namespaced: true, state, actions, mutations, getters };

export default User;

import Auth from "@aws-amplify/auth";
import { AuthAction } from "@/Utils/utils";
import router from "../../router";
import { CognitoUserInterface } from "@aws-amplify/ui-components";
import { ActionTree, GetterTree, MutationTree } from "vuex";
type AuthError = { error: boolean; errorMessage: string };
type State = {
  authAction: AuthAction;
  authenticatedUser: CognitoUserInterface | null;
  loginProgress: boolean;
  confirmSignUp: boolean;
  confirmReset: boolean;
  signUpError: AuthError;
  signInError: AuthError;
  resetError: AuthError;
};
const state: State = {
  authAction: "SignIn",
  authenticatedUser: null,
  loginProgress: false,
  confirmSignUp: false,
  confirmReset: false,
  signInError: { error: false, errorMessage: "" },
  signUpError: { error: false, errorMessage: "" },
  resetError: { error: false, errorMessage: "" },
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
      router.replace({ name: "Browser" });
    } catch (error: any) {
      commit("setLoginProgressState", false);

      commit("setSignInError", { error: true, errorMessage: error.message });
      console.log("error signing in", Object.keys(error));
    }
  },
  async signOut({ commit }) {
    await Auth.signOut();
    commit("setUser", null);
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
      commit("setAuthAction", "Confirm");
      commit("setLoginProgressState", false);
    } catch (error: any) {
      commit("setSignUpError", { error: true, errorMessage: error.message });
      commit("setLoginProgressState", false);
    }
  },
  async confirmSignUp({ commit }, payload: { username: string; code: string }) {
    console.log("Confirming :", payload);
    try {
      const user = await Auth.confirmSignUp(payload.username, payload.code);
      console.log(user);
      commit("setConfirmSignUpState", false);
      commit("setAuthAction", "SignIn");
    } catch (error: any) {
      console.log("error confirming sign up", error);
      commit("setSignUpError", { error: true, errorMessage: error.message });
    }
  },
  async resetPassword({ commit }, email) {
    commit("setResetError", { error: false, errorMessage: "" });
    try {
      const result = await Auth.forgotPassword(email);
      console.log(result);
      commit("setConfirmResetState", true);
      commit("setAuthAction", "ConfirmReset");
    } catch (error: any) {
      commit("setResetError", { error: true, errorMessage: error.message });
      console.log(error.message);
    }
  },
  async confirmReset(
    { commit },
    payload: { email: string; code: string; password: string }
  ) {
    console.log(payload);
    try {
      const result = Auth.forgotPasswordSubmit(
        payload.email,
        payload.code,
        payload.password
      );
      commit("setAuthAction", "SignIn");
      commit("setConfirmResetState", false);
    } catch (error: any) {
      commit("setResetError", { error: true, errorMessage: error.message });
      console.log(error.message);
    }
  },
};

const mutations: MutationTree<State> = {
  setUser(state, user: CognitoUserInterface) {
    state.authenticatedUser = user;
  },
  setAuthAction(state, authAction) {
    state.authAction = authAction;
  },
  setLoginProgressState(state, progressState: boolean) {
    state.loginProgress = progressState;
  },
  setConfirmSignUpState(state, confirmState: boolean) {
    state.confirmSignUp = confirmState;
  },
  setConfirmResetState(state, confirmState: boolean) {
    state.confirmReset = confirmState;
  },
  setSignInError(state, error: AuthError) {
    state.signInError = error;
  },
  setSignUpError(state, error: AuthError) {
    state.signUpError = error;
  },
  setResetError(state, error: AuthError) {
    state.resetError = error;
  },
};
const getters: GetterTree<State, unknown> = {
  getAuthAction: (state) => {
    return state.authAction;
  },
  getLoginProgressState: (state) => {
    return state.loginProgress;
  },
  getConfirmSignUpState: (state) => {
    return state.confirmSignUp;
  },
  getConfirmResetState: (state) => {
    return state.confirmReset;
  },
  getUser: (state) => {
    return state.authenticatedUser;
  },
  getUserEmail: (state) => {
    if (state.authenticatedUser) {
      const userEmail = state.authenticatedUser["attributes"].email;
      return userEmail;
    } else {
      return "No User";
    }
  },
  getUserName: (state) => {
    if (state.authenticatedUser) {
      const userEmail = state.authenticatedUser["attributes"].email;
      return userEmail.split("@")[0];
    } else {
      return "No User";
    }
  },

  getSignInError: (state) => {
    return state.signInError;
  },
  getSignUpError: (state) => {
    return state.signUpError;
  },
  getResetError: (state) => {
    return state.resetError;
  },
};

const User = { namespaced: true, state, actions, mutations, getters };

export default User;

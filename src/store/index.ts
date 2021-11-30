import Vue from "vue";
import Vuex from "vuex";

import User from "../store/modules/User";
import Main from "../store/modules/Main";
import Storage from "../store/modules/Storage";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    User,
    Main,
    Storage,
  },
});

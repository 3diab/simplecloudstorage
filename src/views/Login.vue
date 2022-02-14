<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col>
          <v-container>
            <v-row>
              <v-col>
                <v-img
                  src="../assets/images/openarcloud_logo.png"
                  class="mt-8 pt-4"
                  height="120"
                  contain
                ></v-img>
              </v-col>
            </v-row>
          </v-container>
          <v-card
            max-width="450"
            class="mx-auto"
            rounded="lg"
            flat
            :loading="$store.getters['User/getLoginProgressState']"
          >
            <sign-in
              v-if="getAuthAction === 'SignIn'"
              v-on:change-auth-action="changeAuthAction"
            ></sign-in>
            <sign-up
              v-if="getAuthAction === 'SignUp' || getAuthAction === 'Confirm'"
              v-on:change-auth-action="changeAuthAction"
            ></sign-up>
            <reset
              v-if="
                getAuthAction === 'Reset' || getAuthAction === 'ConfirmReset'
              "
              v-on:change-auth-action="changeAuthAction"
            ></reset>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import SignIn from "../components/Auth/SignIn.vue";
import SignUp from "../components/Auth/SignUp.vue";
import Reset from "../components/Auth/Reset.vue";

import { AuthAction } from "../Utils/utils";

export default Vue.extend({
  name: "Login",
  components: {
    SignIn,
    SignUp,
    Reset,
  },
  data: () => ({
    select: null,
  }),
  methods: {
    changeAuthAction(authAction: AuthAction) {
      this.$store.commit("User/setAuthAction", authAction);
    },
  },
  computed: {
    getAuthAction() {
      return this.$store.getters["User/getAuthAction"];
    },
  },
});
</script>
<style scoped>
.no-uppercase {
  text-transform: none;
}

.v-bar-border {
  background-color: red;
  border-width: 0 0 thin 0;
  border-style: solid;
  border-bottom-color: #0000001f !important;
}
.v-application {
  background-color: #eceff1 !important;
}
.blurred-shadow {
  box-shadow: 0px 0px 60px #dbdbdb !important;
}
</style>

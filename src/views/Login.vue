<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center" class="mt-12">
        <v-col>
          <v-card
            max-width="450"
            class="mx-auto blurred-shadow"
            rounded="lg"
            :loading="$store.getters['User/getLoginProgressState']"
          >
            <v-container>
              <v-row>
                <v-col>
                  <v-img
                    src="../assets/images/landing_illustration.svg"
                    class="mt-8 pt-4"
                    height="120"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
            </v-container>
            <sign-in v-if="authAction === 'SignIn'"></sign-in>
            <sign-up
              v-if="authAction === 'SignUp' || authAction === 'Confirm'"
            ></sign-up>
            <reset v-if="authAction === 'Reset'"></reset>
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
    authAction: "SignIn" as AuthAction,

    select: null,
  }),
  methods: {
    changeAuthAction(authAction: AuthAction) {
      this.authAction = authAction;
    },
  },
});
</script>
<style>
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
  background-color: #ffffff !important;
}
.blurred-shadow {
  box-shadow: 0px 0px 60px #dbdbdb !important;
}
</style>

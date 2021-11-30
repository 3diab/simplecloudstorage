<template>
  <div>
    <v-card-title class="pt-4 text-h6 font-weight-light justify-center">
      <span>Login</span>
    </v-card-title>

    <v-card-text>
      <v-row justify="center">
        <v-col cols="10">
          <v-form
            ref="signInForm"
            v-model="isValidSignIn"
            lazy-validation
            class="px-3"
          >
            <v-text-field
              v-model="signInCredentials.email"
              :rules="emailRules(signInCredentials.email)"
              label="Email"
              required
              background-color="grey lighten-3"
              flat
              outlined
              class="mt-0"
              validate-on-blur
              v-on:keyup.enter="validateSignIn"
            ></v-text-field>

            <v-text-field
              v-model="signInCredentials.password"
              :rules="passwordRules(signInCredentials.password)"
              label="Password"
              required
              type="password"
              background-color="grey lighten-3"
              flat
              outlined
              :error="false"
              v-on:keyup.enter="validateSignIn"
              validate-on-blur
            ></v-text-field>

            <v-text-field
              v-if="false"
              v-model="signInCredentials.permanentPassword"
              label="Enter New Password"
              :rules="passwordRules(signInCredentials.permanentPassword)"
              required
              outlined
              dense
              background-color="grey lighten-4"
              flat
              validate-on-blur
              hint="Password should be atleast 6 character long,with a number , special character, uppercase and lower case letters."
            ></v-text-field>

            <p
              class="caption red--text"
              v-if="$store.getters['User/getSignInError'].error !== null"
            >
              {{ $store.getters["User/getSignInError"].errorMessage }}
            </p>

            <v-btn
              color="grey darken-3"
              @click="validateSignIn"
              block
              depressed
              dark
              large
              :ripple="false"
              :loading="$store.getters['User/getLoginProgressState']"
            >
              Login
            </v-btn>
          </v-form>
        </v-col></v-row
      ></v-card-text
    >
    <v-sheet class="my-2 text-center">
      <span class="text-caption mx-4">
        Don't have an account?<a
          class="font-weight-medium"
          @click="changeAuthAction('SignUp')"
        >
          Sign up here</a
        >
      </span>

      <v-row justify="center">
        <span class="text-caption mx-4 my-3">
          Trouble Signing in?
          <a class="font-weight-medium" @click="changeAuthAction('Reset')"
            >Click Here.</a
          >
        </span>
      </v-row>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  VForm,
  AuthAction,
  UserCredentials,
  emailRules,
  passwordRules,
} from "../../Utils/utils";
export default Vue.extend({
  name: "SignIn",
  data: () => ({
    emailRules,
    passwordRules,
    error: null,
    signInCredentials: {
      email: "",
      password: "",
    } as UserCredentials,
    isValidSignIn: true,
  }),
  methods: {
    validateSignIn() {
      if ((this.$refs.signInForm as VForm).validate()) {
        console.log("Initiating Signing");
        this.signIn();
      }
    },
    async signIn() {
      await this.$store.dispatch("User/signIn", {
        username: this.signInCredentials.email,
        password: this.signInCredentials.password,
      });
    },
  },
});
</script>

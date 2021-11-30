<template>
  <div>
    <v-card-title class="pt-4 text-h6 font-weight-light justify-center">
      <span>Register</span>
    </v-card-title>

    <v-card-text>
      <v-row justify="center">
        <v-col cols="10">
          <v-form
            ref="passwordResetForm"
            v-model="isValidReset"
            lazy-validation
            class="px-3"
          >
            <v-text-field
              v-model="signUpCredentials.email"
              :rules="emailRules(signUpCredentials.email)"
              label="Email"
              required
              validate-on-blur
              background-color="grey lighten-3"
              flat
              outlined
              class="mt-0"
              v-on:keyup.enter="validateSignUp"
            ></v-text-field>

            <v-text-field
              v-model="signUpCredentials.confirmCode"
              label="Enter Code"
              required
              :rules="codeRules(signUpCredentials.confirmCode)"
              outlined
              validate-on-blur
              type="number"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validate"
            ></v-text-field>
            <v-text-field
              v-model="signUpCredentials.password"
              :rules="passwordRules(signUpCredentials.password)"
              label="New password"
              required
              outlined
              validate-on-blur
              type="password"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validateSignUp"
            ></v-text-field>

            <p
              class="caption red--text"
              v-if="$store.getters['User/getSignUpError'].error !== null"
            >
              {{ $store.getters["User/getSignUpError"].errorMessage }}
            </p>

            <v-btn
              color="grey darken-3"
              @click="validateResetPassword"
              block
              depressed
              dark
              large
              :ripple="false"
              :loading="$store.getters['User/getLoginProgressState']"
            >
              {{
                $store.getters["User/setConfirmSignUpState"]
                  ? "Confirm"
                  : "Register"
              }}
            </v-btn>
          </v-form>
        </v-col>
      </v-row></v-card-text
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
      <span class="text-caption mx-4">
        Already have an account?<a
          class="font-weight-medium"
          @click="changeAuthAction('SignIn')"
        >
          Sign In
        </a>
      </span>
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
  codeRules,
} from "../../Utils/utils";

export default Vue.extend({
  name: "Reset",
  data: () => ({
    emailRules,
    passwordRules,
    codeRules,
    error: null,
    authAction: "",
    passwordResetCredentials: {
      email: "",
      confirmCode: "",
      newPassword: "",
    } as UserCredentials,
    isValidReset: true,
  }),
  methods: {
    validateResetPassword() {
      if ((this.$refs.signUpForm as VForm).validate()) {
        if (this.authAction === "Reset") {
          console.log("Initiating Reset");
          // this.confirmSignUp();
        } else {
          console.log("finalizing reset");
          // this.signUp();
        }
      }
    },
  },
});
</script>

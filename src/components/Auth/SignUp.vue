<template>
  <div>
    <v-card-title class="py-4 text-h6 font-weight-medium justify-center">
      <span>REGISTER</span>
    </v-card-title>

    <v-card-text>
      <v-row justify="center">
        <v-col cols="10">
          <v-alert
            dense
            type="info"
            v-if="$store.getters['User/getConfirmSignUpState']"
          >
            Please check email for verification code.
          </v-alert>
          <v-form
            ref="signUpForm"
            v-model="isValidSignUp"
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
              v-model="signUpCredentials.password"
              :rules="passwordRules(signUpCredentials.password)"
              label="Password"
              required
              outlined
              validate-on-blur
              type="password"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validateSignUp"
            ></v-text-field>

            <v-text-field
              v-model="signUpCredentials.confirmCode"
              label="Enter Code"
              required
              outlined
              :rules="codeRules(signUpCredentials.confirmCode)"
              validate-on-blur
              type="number"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validateSignUp"
              v-if="$store.getters['User/getConfirmSignUpState']"
            ></v-text-field>

            <p
              class="caption red--text"
              v-if="$store.getters['User/getSignUpError'].error !== null"
            >
              {{ $store.getters["User/getSignUpError"].errorMessage }}
            </p>

            <v-btn
              color="grey darken-3"
              @click="validateSignUp"
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
      </v-row>
    </v-card-text>
    <v-sheet class="my-2 text-center">
      <span class="text-caption mx-4">
        Already have an account?<a
          class="font-weight-medium"
          @click="changeAuthAction('SignIn')"
        >
          Sign In
        </a>
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
  codeRules,
} from "../../Utils/utils";
export default Vue.extend({
  name: "SignUp",
  data: () => ({
    error: null,
    emailRules,
    passwordRules,
    codeRules,
    signUpCredentials: {
      username: "",
      email: "",
      password: "",
      permanentPassword: "",
    } as UserCredentials,
    isValidSignUp: true,
  }),
  methods: {
    validateSignUp() {
      const authAction = this.$store.getters["User/getAuthAction"];
      if ((this.$refs.signUpForm as VForm).validate()) {
        if (authAction === "Confirm") {
          console.log("Initiating Confirm");
          this.confirmSignUp();
        } else if (authAction === "SignUp") {
          console.log("Initiating SignUp");
          this.signUp();
        }
      }
    },
    async signUp() {
      await this.$store.dispatch("User/signUp", {
        username: this.signUpCredentials.email,
        password: this.signUpCredentials.password,
        email: this.signUpCredentials.email,
        preferred_username: this.signUpCredentials.email,
      });
      //if there are no errors switch to sign in
      if (this.$store.getters["User/setConfirmSignUpState"]) {
        //TODO this.changeAuthAction("Confirm");
      }
    },
    async confirmSignUp() {
      try {
        await this.$store.dispatch("User/confirmSignUp", {
          username: this.signUpCredentials.email,
          code: this.signUpCredentials.confirmCode,
        });
        if (this.$store.getters["User/setConfirmSignUpState"]) {
          //TODO this.changeAuthAction("SignIn");
          this.signUpCredentials.email = "";
          this.signUpCredentials.password = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
    changeAuthAction(authAction: AuthAction) {
      this.$store.commit("User/setAuthAction", authAction);
    },
  },
});
</script>

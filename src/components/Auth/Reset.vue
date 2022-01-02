<template>
  <div>
    <v-card-title
      class="
        pt-7
        text-h6
        font-weight-medium
        justify-center
        grey--text
        text--darken-2
      "
    >
      <span>RESET PASSWORD</span>
    </v-card-title>

    <v-card-text class="mt-4">
      <v-row justify="center">
        <v-col cols="10">
          <v-form
            ref="passwordResetForm"
            v-model="isValidReset"
            lazy-validation
            class="px-3"
          >
            <v-text-field
              v-model="passwordResetCredentials.email"
              :rules="emailRules(passwordResetCredentials.email)"
              label="Email"
              required
              validate-on-blur
              background-color="grey lighten-3"
              flat
              outlined
              class="mt-0"
              v-on:keyup.enter="validateResetPassword"
            ></v-text-field>

            <v-text-field
              v-if="$store.getters['User/getAuthAction'] == 'ConfirmReset'"
              v-model="passwordResetCredentials.confirmCode"
              label="Enter Code"
              required
              :rules="codeRules(passwordResetCredentials.confirmCode)"
              outlined
              validate-on-blur
              type="number"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validateResetPassword"
            ></v-text-field>
            <v-text-field
              v-if="$store.getters['User/getAuthAction'] == 'ConfirmReset'"
              v-model="passwordResetCredentials.newPassword"
              :rules="passwordRules(passwordResetCredentials.newPassword)"
              label="New password"
              required
              outlined
              validate-on-blur
              type="password"
              background-color="grey lighten-3"
              flat
              :error="false"
              v-on:keyup.enter="validateResetPassword"
            ></v-text-field>

            <p
              class="caption red--text"
              v-if="$store.getters['User/getResetError'].error !== null"
            >
              {{ $store.getters["User/getResetError"].errorMessage }}
            </p>

            <v-btn
              color="blue-grey darken-2"
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
                  ? "Set New Password"
                  : "Reset"
              }}
            </v-btn>
          </v-form>
        </v-col>
      </v-row></v-card-text
    >
    <v-sheet class="my-2 text-center">
      <v-row justify="center">
        <span class="text-caption mx-4">
          Don't have an account?<a
            class="font-weight-medium"
            @click="changeAuthAction('SignUp')"
          >
            Sign up here</a
          >
        </span>
      </v-row>
      <v-row justify="center">
        <span class="text-caption mx-4">
          Already have an account?<a
            class="font-weight-medium"
            @click="changeAuthAction('SignIn')"
          >
            Sign In
          </a>
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
  name: "Reset",
  data: () => ({
    emailRules,
    passwordRules,
    codeRules,
    error: null,
    passwordResetCredentials: {
      email: "",
      confirmCode: "",
      newPassword: "",
    } as UserCredentials,
    isValidReset: true,
  }),
  methods: {
    validateResetPassword() {
      const authAction = this.$store.getters["User/getAuthAction"];

      if ((this.$refs.passwordResetForm as VForm).validate()) {
        if (authAction === "Reset") {
          console.log("Initiating Reset");
          this.resetPassword();
        } else {
          console.log("finalizing reset");
          this.confirmReset();
        }
      }
    },
    resetPassword() {
      this.$store.dispatch(
        "User/resetPassword",
        this.passwordResetCredentials.email
      );
    },
    confirmReset() {
      this.$store.dispatch("User/confirmReset", {
        email: this.passwordResetCredentials.email,
        password: this.passwordResetCredentials.newPassword,
        code: this.passwordResetCredentials.confirmCode,
      });
    },
    changeAuthAction(authAction: AuthAction) {
      this.$store.commit("User/setAuthAction", authAction);
    },
  },
});
</script>

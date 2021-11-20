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

            <v-card-title class="pt-4 text-h6 font-weight-light justify-center">
              <span>{{ authAction === "SignIn" ? "Login" : "Register" }}</span>
            </v-card-title>

            <v-card-text>
              <v-row justify="center">
                <v-col cols="10">
                  <v-form
                    ref="signInForm"
                    v-model="isValidSignIn"
                    lazy-validation
                    class="px-3"
                    v-if="authAction === 'SignIn'"
                  >
                    <v-text-field
                      v-model="signInCredentials.email"
                      :rules="emailRules"
                      label="Email"
                      required
                      background-color="grey lighten-3"
                      flat
                      outlined
                      class="mt-0"
                      validate-on-blur
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-model="signInCredentials.password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      type="password"
                      background-color="grey lighten-3"
                      flat
                      outlined
                      :error="false"
                      v-on:keyup.enter="validate"
                      validate-on-blur
                    ></v-text-field>

                    <v-text-field
                      v-if="false"
                      v-model="signInCredentials.permanentPassword"
                      label="Enter New Password"
                      :rules="passwordRules"
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
                      v-if="
                        $store.getters['User/getSignInError'].error !== null
                      "
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
                  <v-form
                    ref="signUpForm"
                    v-model="isValidSignUp"
                    lazy-validation
                    class="px-3"
                    v-if="authAction === 'SignUp' || authAction === 'Confirm'"
                  >
                    <v-text-field
                      v-model="signUpCredentials.email"
                      :rules="emailRules"
                      label="Email"
                      required
                      validate-on-blur
                      background-color="grey lighten-3"
                      flat
                      outlined
                      class="mt-0"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-model="signUpCredentials.password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      outlined
                      validate-on-blur
                      type="password"
                      background-color="grey lighten-3"
                      flat
                      :error="false"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-model="signUpCredentials.confirmCode"
                      label="Enter Code"
                      required
                      outlined
                      validate-on-blur
                      type="number"
                      background-color="grey lighten-3"
                      flat
                      :error="false"
                      v-on:keyup.enter="validate"
                      v-if="$store.getters['User/setConfirmSignUpState']"
                    ></v-text-field>

                    <p
                      class="caption red--text"
                      v-if="
                        $store.getters['User/getSignUpError'].error !== null
                      "
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
                  <v-sheet class="my-2 text-center">
                    <span
                      class="text-caption mx-4"
                      v-if="authAction === 'SignIn'"
                    >
                      Don't have an account?<a
                        class="font-weight-medium"
                        @click="changeAuthAction('SignUp')"
                      >
                        Sign up here</a
                      >
                    </span>
                    <span
                      class="text-caption mx-4"
                      v-if="authAction === 'SignUp'"
                    >
                      Already have an account?<a
                        class="font-weight-medium"
                        @click="changeAuthAction('SignIn')"
                      >
                        Sign In
                      </a>
                    </span>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="auto" class="mb-8">
                  <v-btn
                    v-if="false"
                    color="blue-grey lighten-5"
                    depressed
                    large
                    class="
                      text-none text-lg-subtitle-1
                      font-weight-regular
                      mx-6
                    "
                  >
                    <v-img
                      width="20"
                      height="20"
                      class="mr-4"
                      src="../assets/images/google.png"
                    ></v-img>

                    Continue With Google
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

interface UserCredentials {
  email: string;
  password: string;
  permanentPassword?: string;
  confirmCode?: string;
}

type VForm = Vue & { validate: () => boolean };

type AuthAction = "SignIn" | "SignUp" | "Confirm";

export default Vue.extend({
  name: "Login",
  data: () => ({
    signUpCredentials: {
      username: "",
      email: "",
      password: "",
      permanentPassword: "",
    } as UserCredentials,
    signInCredentials: {
      email: "",
      password: "",
    } as UserCredentials,
    authAction: "SignIn" as AuthAction,

    error: null,
    isValidSignIn: true,
    isValidSignUp: true,

    emailRules: [
      (v: string) => !!v || "Name is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    usernameRules: [(v: string) => !!v || "Name is required"],

    passwordRules: [
      (v: string) => !!v || "Password is required",
      //(v) =>(v && v.length >= 6) || "Password must be greater than 6 characters",
      (v: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          v
        ) ||
        "Password should be atleast 6 character long,with a number , special character, uppercase and lower case letters.",
    ],
    select: null,
  }),
  methods: {
    validateSignIn() {
      if ((this.$refs.signInForm as VForm).validate()) {
        console.log("Initiating Signing");
        this.signIn();
      }
    },
    validateSignUp() {
      if ((this.$refs.signUpForm as VForm).validate()) {
        if (this.authAction === "Confirm") {
          console.log("Initiating Confirm");
          this.confirmSignUp();
        } else {
          console.log("Initiating SignUp");
          this.signUp();
        }
      }
    },
    changeAuthAction(authAction: AuthAction) {
      this.authAction = authAction;
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
        this.changeAuthAction("Confirm");
      }
    },
    async confirmSignUp() {
      try {
        await this.$store.dispatch("User/confirmSignUp", {
          username: this.signUpCredentials.email,
          code: this.signUpCredentials.confirmCode,
        });
        if (this.$store.getters["User/setConfirmSignUpState"]) {
          this.changeAuthAction("SignIn");
          this.signUpCredentials.email = "";
          this.signUpCredentials.password = "";
        }
      } catch (error) {
        console.log(error);
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

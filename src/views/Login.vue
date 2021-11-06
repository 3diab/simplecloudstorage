<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center" class="mt-12">
        <v-col>
          <v-card
            max-width="450"
            class="mx-auto blurred-shadow"
            rounded="lg"
            :loading="false"
          >
            <v-container>
              <v-row>
                <v-col>
                  <v-img
                    src="../assets/images/landing_illustration.svg"
                    class="mt-8 pt-4"
                    height="150"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
            </v-container>

            <v-card-title class="pt-4 text-h6 font-weight-light justify-center">
              <span>Welcome to Simple Cloud Storage</span>
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
                      solo
                      background-color="grey lighten-3"
                      flat
                      class="mt-0"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-model="signInCredentials.password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      type="password"
                      solo
                      background-color="grey lighten-3"
                      flat
                      :error="false"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-if="false"
                      v-model="signInCredentials.permanentPassword"
                      label="Enter New Password"
                      :rules="passwordRules"
                      required
                      outlined
                      solo
                      dense
                      background-color="grey lighten-4"
                      flat
                      hint="Password should be atleast 6 character long,with a number , special character, uppercase and lower case letters."
                    ></v-text-field>

                    <p class="caption red--text" v-if="error !== null">
                      {{ error }}
                    </p>

                    <v-btn
                      color="grey darken-3"
                      @click="validateSignIn"
                      block
                      depressed
                      dark
                      large
                      :ripple="false"
                    >
                      Login
                    </v-btn>
                  </v-form>
                  <v-form
                    ref="signUpForm"
                    v-model="isValidSignUp"
                    lazy-validation
                    class="px-3"
                    v-if="authAction === 'SignUp'"
                  >
                    <v-text-field
                      v-model="signUpCredentials.email"
                      :rules="emailRules"
                      label="Email"
                      required
                      solo
                      background-color="grey lighten-3"
                      flat
                      class="mt-0"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <v-text-field
                      v-model="signUpCredentials.password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      type="password"
                      solo
                      background-color="grey lighten-3"
                      flat
                      :error="false"
                      v-on:keyup.enter="validate"
                    ></v-text-field>

                    <p class="caption red--text" v-if="error !== null">
                      {{ error }}
                    </p>

                    <v-btn
                      color="grey darken-3"
                      @click="validateSignUp"
                      block
                      depressed
                      dark
                      large
                      :ripple="false"
                    >
                      Register
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
              <v-divider class="my-3"></v-divider>
              <v-row justify="center">
                <v-col cols="auto" class="mb-8">
                  <v-btn
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
  permanentPassword: string;
}

type AuthAction = "SignIn" | "SignUp";

export default Vue.extend({
  name: "Login",
  data: () => ({
    signUpCredentials: {
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
      if (
        (this.$refs.signInForm as Vue & { validate: () => boolean }).validate()
      ) {
        console.log("Initiating Signing");
      }
    },
    validateSignUp() {
      if (
        (this.$refs.signUpForm as Vue & { validate: () => boolean }).validate()
      ) {
        console.log("Initiating Signing");
      }
    },
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

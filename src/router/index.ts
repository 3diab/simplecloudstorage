import Vue from "vue";
import { Auth } from "aws-amplify";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      //requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);

  console.log(
    `Routing from ${from.name} to ${to.name} . [Requires Authentication:${requiresAuth}]`
  );
  if (requiresAuth) {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then((user) => {
        console.log(user);
        next();
      })
      .catch((err) => {
        console.log(err);
        next("/login");
      });
  } else {
    next();
  }
});
export default router;

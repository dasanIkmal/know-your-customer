import { createMemoryHistory, createRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

import User from "../pages/user.vue";
import Admin from "../pages/admin.vue";
import Login from "../pages/login.vue";
import Register from "../pages/register.vue";

const routes = [
  { path: "/", component: Login, meta: { public: true } }, // Public route
  {
    path: "/user",
    component: User,
    meta: { requiresAuth: true, role: "user" }, // Protected route for users
  },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, role: "admin" }, // Protected route for admins
  },
  { path: "/register", component: Register, meta: { public: true } }, // Public route
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      // Redirect to login if no token is found
      return next("/");
    }

    // Check if the user role matches the required role
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      // Redirect based on the user role
      if (authStore.user?.role === "admin") {
        return next("/admin");
      } else if (authStore.user?.role === "user") {
        return next("/user");
      } else {
        return next("/"); // Fallback to login
      }
    }
  }

  // Allow navigation for public routes or if authentication is not required
  next();
});

export default router;

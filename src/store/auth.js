import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({});
  const token = ref("");

  // Action to set user and token
  const setAuthData = ({ user: userData, token: accessToken }) => {
    user.value = userData;
    token.value = accessToken;
  };

  // Action to clear user and token (e.g., logout)
  const clearAuth = () => {
    user.value = null;
    token.value = "";
  };

  return { user, token, setAuthData, clearAuth };
});

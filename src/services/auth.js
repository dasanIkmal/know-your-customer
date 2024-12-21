import axios from "./axios";

const AuthService = {
  async register(username, email, password) {
    try {
      const response = await axios.post("/user/register", {
        username,
        email,
        password,
      });
      return response; // Return the response data for further use
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
  async login(email, password) {
    try {
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });
      return response; // Return the response data for further use
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
};

export default AuthService;

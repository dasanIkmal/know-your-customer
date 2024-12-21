<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center">Register</h2>
      <el-form :model="registerForm" :rules="rules" label-position="top">
        <el-form-item label="Username" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="Enter your username"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="Enter your email"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Enter your password"
          ></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm your password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">Register</el-button>
        </el-form-item>
      </el-form>
      <div>
        <router-link to="/">Already have an account? Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import AuthService from "../services/auth";

const router = useRouter();

const registerForm = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = {
  username: [
    { required: true, message: "Please input your username", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Please input your email", trigger: "blur" },
    {
      type: "email",
      message: "Please input a valid email address",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please input your password", trigger: "blur" },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Please confirm your password",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error("Passwords do not match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const validateForm = () => {
  if (!registerForm.value.username) {
    ElMessage.error("Username is required.");
    return false;
  }

  if (!registerForm.value.email) {
    ElMessage.error("Email is required.");
    return false;
  }

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerForm.value.email)) {
    ElMessage.error("Please provide a valid email address.");
    return false;
  }

  if (!registerForm.value.password) {
    ElMessage.error("Password is required.");
    return false;
  }

  if (registerForm.value.password.length < 8) {
    ElMessage.error("Password must be at least 8 characters long.");
    return false;
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error("Passwords do not match.");
    return false;
  }

  return true; // Validation passed
};
const handleRegister = () => {
  // Perform validation
  if (!validateForm()) {
    return; // Stop execution if validation fails
  }

  // If validation passes, proceed to register
  AuthService.register(
    registerForm.value.username,
    registerForm.value.email,
    registerForm.value.password
  )
    .then((response) => {
      if (response.status === 201) {
        // Show success message and redirect to login
        ElMessage.success(response.data.message || "Registration successful");
        router.push("/"); // Redirect to the login page
      }
    })
    .catch((error) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          // Email already exists
          ElMessage.error(
            data.message ||
              "Email already registered. Please use a different email."
          );
        } else if (status === 500) {
          // Internal server error
          ElMessage.error("Server error. Please try again later.");
        } else {
          // Other unexpected status codes
          ElMessage.error(
            data.message || "Registration failed. Please try again."
          );
        }
      } else if (error.request) {
        // No response received from the server
        ElMessage.error(
          "No response from server. Please check your network connection."
        );
      } else {
        // Other unexpected errors
        ElMessage.error(error.message || "An unexpected error occurred.");
      }

      console.error("Error during registration:", error);
    });
};
</script>

<style scoped>
/* Add any additional styles here */
</style>

import { createAsysncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../Utils/AxiosInstance";

const initialState = {
  auth: JSON.parse(localStorage.getItem("auth")) || null,
  isLoading: false,
  error: null,
};

export const registerUser = createAsysncThunk(
  "auth-register",
  async (userData) => {
    try {
      const response = await axiosInstance.post("/api/auth-register", userData);
      toast.success("Registration successful");
      // Save the user data to localStorage
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response.data.message || "Registration failed");
      console.log("User register failed", error);
    }
  }
);

export const loginUser = createAsysncThunk("auth-login", async (userData) => {
  try {
    const response = await axiosInstance.post("/api/auth-login", userData);
    toast.success("Login successful");
    // Save the user data to localStorage
    return response?.data?.user;
  } catch (error) {
    toast.error(error.response.data.message || "Login failed");
    console.log("User login failed", error);
  }
});

export const logoutUser = createAsysncThunk("auth-logout", async () => {
  try {
    const response = await axiosInstance.get("/api/auth-logout");
    toast.success("Logout successful");
    // Clear the user data from localStorage
    return null;
  } catch (error) {
    toast.error(error.response.data.message || "Logout failed");
    console.log("User logout failed", error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.auth = null;
        localStorage.removeItem("auth");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;

import { create } from "zustand";
import axiosInstance from "../src/lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  // state variables
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,

  // update functions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkauth");
      set({ authUser: res.data });
      // console.log(res.data);
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("Error in signup:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    set({ authUser: null });
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("Error in logout:", error);
    }
  },
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("Error in login:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));

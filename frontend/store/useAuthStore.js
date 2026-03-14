import { create } from "zustand";
import axiosInstance from "../src/lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  // state variables
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  onlineUsers: [],
  socket: null,

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;
    const socket = io("http://localhost:3000", {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // update functions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/checkauth");
      set({ authUser: res.data });
      // console.log(res.data);
      get().connectSocket(); //connecting socket
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
      get().connectSocket(); //connecting socket
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
      get().disconnectSocket(); //disconnecting socket
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
      get().connectSocket(); //connecting socket
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log("Error in login:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));

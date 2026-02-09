import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  sbpAdminLoginApi,
  sbpAdminRefreshApi,
  sbpAdminLogoutApi,
  sbpAdminMeApi,
  sbpAdminUpdateApi,
  sbpAdminDeleteApi,
  registerBankOfficerApi,
  getAllBankOfficersApi,
  getAllUsersApi,
  sbpAdminForgotPasswordApi,
 sbpAdminResetPasswordApi,
  sbpAdminUpdatePasswordApi,
  sbpAdminDashboardApi,
  
} from "../../../services/sbp_adminApi";

/* ================= AUTH ================= */

export const sbpAdminLoginThunk = createAsyncThunk(
  "sbpAdmin/login",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await sbpAdminLoginApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const sbpAdminRefreshThunk = createAsyncThunk(
  "sbpAdmin/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sbpAdminRefreshApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Session expired");
    }
  }
);

export const sbpAdminLogoutThunk = createAsyncThunk(
  "sbpAdmin/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sbpAdminLogoutApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* ================= PROFILE ================= */

export const sbpAdminMeThunk = createAsyncThunk(
  "sbpAdmin/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sbpAdminMeApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

export const sbpAdminUpdateThunk = createAsyncThunk(
  "sbpAdmin/updateProfile",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await sbpAdminUpdateApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Profile update failed");
    }
  }
);

export const sbpAdminDeleteThunk = createAsyncThunk(
  "sbpAdmin/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sbpAdminDeleteApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Account deletion failed");
    }
  }
);

/* ================= PASSWORD ================= */

export const sbpAdminForgotPasswordThunk = createAsyncThunk(
  "sbpAdmin/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await sbpAdminForgotPasswordApi(email);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Forgot password failed");
    }
  }
);

export const sbpAdminResetPasswordThunk = createAsyncThunk(
  "sbpAdmin/resetPassword",
  async (
    data: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await sbpAdminResetPasswordApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Reset password failed");
    }
  }
);

export const sbpAdminUpdatePasswordThunk = createAsyncThunk(
  "sbpAdmin/updatePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await sbpAdminUpdatePasswordApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update password failed");
    }
  }
);

/* ================= USERS ================= */

export const registerBankOfficerThunk = createAsyncThunk(
  "sbpAdmin/registerBankOfficer",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await registerBankOfficerApi(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Registration failed");
    }
  }
);

export const getAllBankOfficersThunk = createAsyncThunk(
  "sbpAdmin/getAllBankOfficers",
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await getAllBankOfficersApi(params);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch bank officers");
    }
  }
);

export const getAllUsersThunk = createAsyncThunk(
  "sbpAdmin/getAllUsers",
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await getAllUsersApi(params);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

/* ================= DASHBOARD ================= */

export const sbpAdminDashboardThunk = createAsyncThunk(
  "sbpAdmin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await sbpAdminDashboardApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Dashboard fetch failed");
    }
  }
);

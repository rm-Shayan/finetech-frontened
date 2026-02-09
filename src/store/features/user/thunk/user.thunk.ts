import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  getMeApi,
  logoutApi,
  refreshTokenApi,
  deleteAccountApi,
  getDashboardApi,
  updateUserApi,
  updatePasswordApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../../../services/userApi";

/* ================= TYPES ================= */

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/* ================= AUTH THUNKS ================= */
// ---------- Signup ----------
export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await signupApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// ---------- Login ----------
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ---------- Get Current User ----------
export const getMeThunk = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeApi();
      return res.data;
    } catch {
      return rejectWithValue("Unauthorized");
    }
  }
);

// ---------- Update User ----------
export const updateUserThunk = createAsyncThunk(
  "auth/updateUser",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* ================= PASSWORD THUNKS ================= */
// Forgot Password
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(email);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Forgot password failed");
    }
  }
);

// Reset Password
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Reset password failed");
    }
  }
);

// Update Password
export const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  async (data: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const res = await updatePasswordApi(data); // just pass data
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update password failed");
    }
  }
);

/* ================= DASHBOARD THUNK ================= */
export const getDashboardThunk = createAsyncThunk(
  "auth/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDashboardApi();
      return res.data;
    } catch {
      return rejectWithValue("Failed to load dashboard");
    }
  }
);

/* ================= TOKEN THUNK ================= */
export const refreshTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await refreshTokenApi();
      return res.data;
    } catch {
      return rejectWithValue("Session expired");
    }
  }
);

/* ================= ACCOUNT THUNKS ================= */
// Delete Account
export const deleteAccountThunk = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccountApi();
      return true;
    } catch {
      return rejectWithValue("Delete account failed");
    }
  }
);

// Logout
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch {
      return rejectWithValue("Logout failed");
    }
  }
);

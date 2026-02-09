import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  bankOfficerLoginApi,
  bankOfficerRefreshApi,
  bankOfficerLogoutApi,
  bankOfficerMeApi,
  bankOfficerUpdateApi,
  bankOfficerDeleteApi,
  bankOfficerDashboardApi,
  bankOfficerForgotPasswordApi,
  bankOfficerResetPasswordApi,
  bankOfficerUpdatePasswordApi,
  bankOfficergetAllUsersApi
} from "../../../services/bankOfficerApi";

/* ================= LOGIN ================= */
export const bankOfficerLoginThunk = createAsyncThunk(
  "bankOfficer/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await bankOfficerLoginApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/* ================= REFRESH TOKEN ================= */
export const bankOfficerRefreshThunk = createAsyncThunk(
  "bankOfficer/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bankOfficerRefreshApi();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Refresh failed");
    }
  }
);

/* ================= GET ME ================= */
export const bankOfficerMeThunk = createAsyncThunk(
  "bankOfficer/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bankOfficerMeApi();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Fetch user failed");
    }
  }
);

/* ================= UPDATE PROFILE ================= */
export const bankOfficerUpdateThunk = createAsyncThunk(
  "bankOfficer/update",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await bankOfficerUpdateApi(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* ================= UPDATE PASSWORD ================= */
export const bankOfficerUpdatePasswordThunk = createAsyncThunk(
  "bankOfficer/updatePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await bankOfficerUpdatePasswordApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update password failed");
    }
  }
);

/* ================= FORGOT PASSWORD ================= */
export const bankOfficerForgotPasswordThunk = createAsyncThunk(
  "bankOfficer/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await bankOfficerForgotPasswordApi(email);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Forgot password failed");
    }
  }
);

/* ================= RESET PASSWORD ================= */
export const bankOfficerResetPasswordThunk = createAsyncThunk(
  "bankOfficer/resetPassword",
  async (
    data: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await bankOfficerResetPasswordApi(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Reset password failed");
    }
  }
);

/* ================= DELETE ACCOUNT ================= */
export const bankOfficerDeleteThunk = createAsyncThunk(
  "bankOfficer/delete",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bankOfficerDeleteApi();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

/* ================= LOGOUT ================= */
export const bankOfficerLogoutThunk = createAsyncThunk(
  "bankOfficer/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bankOfficerLogoutApi();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

/* ================= DASHBOARD ================= */
export const bankOfficerDashboardThunk = createAsyncThunk(
  "bankOfficer/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bankOfficerDashboardApi();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Dashboard fetch failed");
    }
  }
);

/* ================ Get All Users ============== */
export const bankOfficerGetAllUsersThunk = createAsyncThunk(
  "bank/getAllUsers",
  async (params: any, { rejectWithValue }) => {
    try {
          console.log("params",params)
     if (!params?.bankCode?.trim()) {
  return rejectWithValue("bankCode required");
}

      // console.log("params",params)
      const res = await bankOfficergetAllUsersApi(params);
      return res.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

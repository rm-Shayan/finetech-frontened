import { createSlice,} from "@reduxjs/toolkit";
import {
  bankOfficerLoginThunk,
  bankOfficerRefreshThunk,
  bankOfficerLogoutThunk,
  bankOfficerMeThunk,
  bankOfficerUpdateThunk,
  bankOfficerDeleteThunk,
  bankOfficerDashboardThunk,
  bankOfficerForgotPasswordThunk,
  bankOfficerResetPasswordThunk,
  bankOfficerUpdatePasswordThunk,
  bankOfficerGetAllUsersThunk, // ✅ Add this
} from "./thunk/bankOfficer.thunk";

import type { AuthState } from "../user/userSlice";
import type { PaginatedUsers } from "../sbp_admin/sbp_adminSlice";

interface BankOfficerState extends AuthState {
  users: PaginatedUsers | null;
  passwordResetMessage: string | null;
  loadingUsers: boolean;
  loading: boolean; // global loading for login, dashboard, update, etc.
  error: string | null;
}

const initialState: BankOfficerState = {
  user: null,
  dashboard: null,
  users: null,
  loading: false,
  loadingUsers: false,
  error: null,
  isAuthenticated: false,
  passwordResetMessage: null,
};

const bankOfficerSlice = createSlice({
  name: "bankOfficer",
  initialState,
  reducers: {
    clearBankOfficerState: (state) => {
      state.error = null;
      state.passwordResetMessage = null;
    },
  },
  extraReducers: (builder) => {
    /* ================= LOGIN ================= */
    builder
      .addCase(bankOfficerLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bankOfficerLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.user;
        state.user = user || null;
        state.isAuthenticated = !!user;
      })
      .addCase(bankOfficerLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= REFRESH ================= */
      .addCase(bankOfficerRefreshThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bankOfficerRefreshThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || null;
        state.isAuthenticated = true;
      })
      .addCase(bankOfficerRefreshThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      /* ================= ME ================= */
      .addCase(bankOfficerMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bankOfficerMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || action.payload?.user || null;
        state.isAuthenticated = true;
      })
      .addCase(bankOfficerMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      /* ================= UPDATE PROFILE ================= */
      .addCase(bankOfficerUpdateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bankOfficerUpdateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || state.user;
      })
      .addCase(bankOfficerUpdateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= UPDATE PASSWORD ================= */
      .addCase(bankOfficerUpdatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(bankOfficerUpdatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Password updated successfully";
      })
      .addCase(bankOfficerUpdatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= FORGOT PASSWORD ================= */
      .addCase(bankOfficerForgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(bankOfficerForgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Reset link sent to email";
      })
      .addCase(bankOfficerForgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= RESET PASSWORD ================= */
      .addCase(bankOfficerResetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(bankOfficerResetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(bankOfficerResetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= DASHBOARD ================= */
      .addCase(bankOfficerDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bankOfficerDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(bankOfficerDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= GET ALL USERS ================= */
      .addCase(bankOfficerGetAllUsersThunk.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(bankOfficerGetAllUsersThunk.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = {
          page: action.payload?.data?.page ?? 1,
          limit: action.payload?.data?.limit ?? 20,
          total: action.payload?.data?.total ?? 0,
          totalPages: action.payload?.data?.totalPages ?? 0,
          users: action.payload?.data?.users || [],
        };
      })
      .addCase(bankOfficerGetAllUsersThunk.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload as string;
      })

      /* ================= LOGOUT ================= */
      .addCase(bankOfficerLogoutThunk.fulfilled, () => initialState)
      .addCase(bankOfficerLogoutThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      /* ================= DELETE ================= */
      .addCase(bankOfficerDeleteThunk.fulfilled, () => initialState)
      .addCase(bankOfficerDeleteThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearBankOfficerState } = bankOfficerSlice.actions;
export default bankOfficerSlice.reducer;

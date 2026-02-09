import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  sbpAdminLoginThunk,
  sbpAdminRefreshThunk,
  sbpAdminLogoutThunk,
  sbpAdminMeThunk,
  sbpAdminUpdateThunk,
  sbpAdminDeleteThunk,
  registerBankOfficerThunk,
  getAllBankOfficersThunk,
  getAllUsersThunk,
  sbpAdminDashboardThunk,
  sbpAdminForgotPasswordThunk,
  sbpAdminResetPasswordThunk,
  sbpAdminUpdatePasswordThunk,
} from "./thunk/sbp_admin.thunk";
import type { AuthState, UserType } from "../user/userSlice";

export interface PaginatedUsers {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  users: UserType[];
}

interface SBPAdminState extends AuthState {
  bankOfficers: PaginatedUsers | null;
  users: PaginatedUsers | null;
  passwordResetMessage: string | null;
  loadingBankOfficers: boolean;
  loadingUsers: boolean;
  loading: boolean; // global loading for login, dashboard, update, etc.
}

const initialState: SBPAdminState = {
  user: null,
  dashboard: null,
  bankOfficers: null,
  users: null,
  loading: false,
  loadingBankOfficers: false,
  loadingUsers: false,
  error: null,
  isAuthenticated: false,
  passwordResetMessage: null,
};

// Generic pending handler for global actions
const handlePending = (state: SBPAdminState) => {
  state.loading = true;
  state.error = null;
  state.passwordResetMessage = null;
};

// Generic rejected handler for all actions
const handleRejected = (state: SBPAdminState, action: PayloadAction<any>) => {
  state.loading = false;
  state.loadingBankOfficers = false;
  state.loadingUsers = false;
  state.error = action.payload as string;
};

const sbpAdminSlice = createSlice({
  name: "sbpAdmin",
  initialState,
  reducers: {
    clearSBPAdminError: (state) => {
      state.error = null;
      state.passwordResetMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ================= LOGIN ================= */
      .addCase(sbpAdminLoginThunk.pending, handlePending)
      .addCase(sbpAdminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.user;
        state.user = user || null;
        state.isAuthenticated = !!user;
      })
      .addCase(sbpAdminLoginThunk.rejected, handleRejected)

      /* ================= REFRESH ================= */
      .addCase(sbpAdminRefreshThunk.pending, handlePending)
      .addCase(sbpAdminRefreshThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.user;
        state.user = user || null;
        state.isAuthenticated = true;
      })
      .addCase(sbpAdminRefreshThunk.rejected, (state, action) => {
        Object.assign(state, initialState);
        state.error = action.payload as string;
      })

      /* ================= ME ================= */
      .addCase(sbpAdminMeThunk.pending, handlePending)
      .addCase(sbpAdminMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data || action.payload?.user;
        state.user = user || null;
        state.isAuthenticated = true;
      })
      .addCase(sbpAdminMeThunk.rejected, (state, action) => {
        Object.assign(state, initialState);
        state.error = action.payload as string;
      })

      /* ================= UPDATE ================= */
      .addCase(sbpAdminUpdateThunk.pending, handlePending)
      .addCase(sbpAdminUpdateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || state.user;
      })
      .addCase(sbpAdminUpdateThunk.rejected, handleRejected)

      /* ================= REGISTER BANK OFFICER ================= */
      .addCase(registerBankOfficerThunk.pending, handlePending)
      .addCase(registerBankOfficerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerBankOfficerThunk.rejected, handleRejected)

      /* ================= GET BANK OFFICERS ================= */
      .addCase(getAllBankOfficersThunk.pending, (state) => {
        state.loadingBankOfficers = true;
        state.error = null;
      })
      .addCase(getAllBankOfficersThunk.fulfilled, (state, action) => {
        state.loadingBankOfficers = false;
        state.bankOfficers = {
          page: action.payload?.data?.page ?? 1,
          limit: action.payload?.data?.limit ?? 20,
          total: action.payload?.data?.total ?? 0,
          totalPages: action.payload?.data?.totalPages ?? 0,
          users: action.payload?.data?.users || [],
        };
      })
      .addCase(getAllBankOfficersThunk.rejected, (state, action) => {
        state.loadingBankOfficers = false;
        state.error = action.payload as string;
      })

      /* ================= GET USERS ================= */
      .addCase(getAllUsersThunk.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = {
          page: action.payload?.data?.page ?? 1,
          limit: action.payload?.data?.limit ?? 20,
          total: action.payload?.data?.total ?? 0,
          totalPages: action.payload?.data?.totalPages ?? 0,
          users: action.payload?.data?.users || [],
        };
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload as string;
      })

      /* ================= DASHBOARD ================= */
      .addCase(sbpAdminDashboardThunk.pending, handlePending)
      .addCase(sbpAdminDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(sbpAdminDashboardThunk.rejected, handleRejected)

      /* ================= PASSWORD THUNKS ================= */
      .addCase(sbpAdminForgotPasswordThunk.pending, handlePending)
      .addCase(sbpAdminForgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Reset link sent to email";
      })
      .addCase(sbpAdminForgotPasswordThunk.rejected, handleRejected)

      .addCase(sbpAdminResetPasswordThunk.pending, handlePending)
      .addCase(sbpAdminResetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(sbpAdminResetPasswordThunk.rejected, handleRejected)

      .addCase(sbpAdminUpdatePasswordThunk.pending, handlePending)
      .addCase(sbpAdminUpdatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage =
          action.payload?.message || "Password updated successfully";
      })
      .addCase(sbpAdminUpdatePasswordThunk.rejected, handleRejected)

      /* ================= LOGOUT ================= */
      .addCase(sbpAdminLogoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sbpAdminLogoutThunk.fulfilled, () => initialState)
      .addCase(sbpAdminLogoutThunk.rejected, handleRejected)

      /* ================= DELETE ================= */
      .addCase(sbpAdminDeleteThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sbpAdminDeleteThunk.fulfilled, () => initialState)
      .addCase(sbpAdminDeleteThunk.rejected, handleRejected);
  },
});

export const { clearSBPAdminError } = sbpAdminSlice.actions;
export default sbpAdminSlice.reducer;

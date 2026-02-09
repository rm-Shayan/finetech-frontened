import { createSlice } from "@reduxjs/toolkit";
import {
  signupThunk,
  loginThunk,
  getMeThunk,
  logoutThunk,
  refreshTokenThunk,
  deleteAccountThunk,
  getDashboardThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  updatePasswordThunk,
} from "./thunk/user.thunk";

type UserRole = "customer" | "bank_officer" | "sbp_admin";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  bankId?: string | null;
  avatar?: { url: string; public_id: string };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: UserType | null;
  dashboard: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  passwordResetMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  dashboard: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  passwordResetMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.passwordResetMessage = null;
    },
    resetAuthState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- SIGNUP ---------- */
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- LOGIN ---------- */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.user;
        state.user = user || null;
        state.isAuthenticated = !!user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      /* ---------- GET ME ---------- */
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data || action.payload?.user;
        state.user = user || null;
        state.isAuthenticated = !!user;
      })
      .addCase(getMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Unauthorized";
      })

      /* ---------- REFRESH TOKEN ---------- */
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state) => {
        // ✅ Mark authenticated, user will be fetched separately
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      /* ---------- LOGOUT ---------- */
      .addCase(logoutThunk.fulfilled, (_) => initialState)

      /* ---------- DELETE ACCOUNT ---------- */
      .addCase(deleteAccountThunk.fulfilled, (state) => {
        state.user = null;
        state.dashboard = null;
        state.isAuthenticated = false;
      })

      /* ---------- UPDATE USER ---------- */
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || state.user;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- DASHBOARD ---------- */
      .addCase(getDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;

      })
      .addCase(getDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- PASSWORD FLOWS ---------- */
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage = action.payload?.message || "Reset link sent to email";
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage = action.payload?.message || "Password reset successfully";
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordResetMessage = null;
      })
      .addCase(updatePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetMessage = action.payload?.message || "Password updated successfully";
      })
      .addCase(updatePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

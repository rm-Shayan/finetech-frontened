import { API } from "../../config/axios";

/* ========== TYPES ========== */
export interface QueryParams {
  page?: number;
  limit?: number;
  bankCode?: string;
  search?: string;
  status?: string;
}

/* ================= BASE PATH ================= */
const SBP_ADMIN_AUTH = "auth/sbp_admin";

/* ================= AUTH ================= */
export const sbpAdminLoginApi = (data: any) =>
  API.post(`${SBP_ADMIN_AUTH}/login`, data);

export const sbpAdminRefreshApi = () =>
  API.get(`${SBP_ADMIN_AUTH}/refresh`);

export const sbpAdminLogoutApi = () =>
  API.post(`${SBP_ADMIN_AUTH}/logout`);

/* ================= PROFILE ================= */
export const sbpAdminMeApi = () =>
  API.get(`${SBP_ADMIN_AUTH}/me`);

export const sbpAdminUpdateApi = (data: FormData) =>
  API.patch(`${SBP_ADMIN_AUTH}/update`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const sbpAdminDeleteApi = () =>
  API.delete(`${SBP_ADMIN_AUTH}/delete`);

/* ================= PASSWORD ================= */
export const sbpAdminForgotPasswordApi = (email: string) =>
  API.post(`${SBP_ADMIN_AUTH}/forgot-password`, { email });

export const sbpAdminResetPasswordApi = (data: {
  token: string;
  newPassword: string;
}) =>
  API.post(`${SBP_ADMIN_AUTH}/reset-password`, data);

export const sbpAdminUpdatePasswordApi = (data: {
  currentPassword: string;
  newPassword: string;
}) =>
  API.post(`${SBP_ADMIN_AUTH}/update-password`, data);

/* ================= SBP ADMIN ACTIONS ================= */
export const registerBankOfficerApi = (data: any) =>
  API.post(`${SBP_ADMIN_AUTH}/register-bank-officer`, data);

export const getAllBankOfficersApi = (params?: QueryParams) =>
  API.get(`${SBP_ADMIN_AUTH}/users/bank-officers`, {
    params: params ?? {},
  });

export const getAllUsersApi = (params?: QueryParams) =>
  API.get(`${SBP_ADMIN_AUTH}/users/all`, {
    params: params ?? {},
  });

/* ================= DASHBOARD ================= */
export const sbpAdminDashboardApi = () =>
  API.get(`${SBP_ADMIN_AUTH}/dashboard`);

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
const BANK_OFFICER_AUTH = "auth/Bank_officer";

/* ================= AUTH ================= */
export const bankOfficerLoginApi = (data: any) =>
  API.post(`${BANK_OFFICER_AUTH}/login`, data);

export const bankOfficerRefreshApi = () =>
  API.get(`${BANK_OFFICER_AUTH}/refresh`);

export const bankOfficerLogoutApi = () =>
  API.post(`${BANK_OFFICER_AUTH}/logout`);

/* ================= PROFILE ================= */
export const bankOfficerMeApi = () =>
  API.get(`${BANK_OFFICER_AUTH}/me`);

export const bankOfficerUpdateApi = (data: FormData) =>
  API.patch(`${BANK_OFFICER_AUTH}/update`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const bankOfficerDeleteApi = () =>
  API.delete(`${BANK_OFFICER_AUTH}/delete`);

/* ================= PASSWORD ================= */
export const bankOfficerForgotPasswordApi = (email: string) =>
  API.post(`${BANK_OFFICER_AUTH}/forgot-password`, { email });

export const bankOfficerResetPasswordApi = (data: {
  token: string;
  newPassword: string;
}) =>
  API.post(`${BANK_OFFICER_AUTH}/reset-password`, data);

export const bankOfficerUpdatePasswordApi = (data: {
  currentPassword: string;
  newPassword: string;
}) =>
  API.post(`${BANK_OFFICER_AUTH}/update-password`, data);

/* ================= DASHBOARD ================= */
export const bankOfficerDashboardApi = () =>
  API.get(`${BANK_OFFICER_AUTH}/dashboard`);

// Users

export const bankOfficergetAllUsersApi = (params?: QueryParams) =>
  API.get(`${BANK_OFFICER_AUTH}/users`, {
    params: params ?? {},
  });


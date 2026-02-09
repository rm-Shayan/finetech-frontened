import { API } from "../../config/axios";

/* ================= BASE PATH ================= */
const USER_AUTH = "auth/user";

/* ================= AUTH ================= */
export const signupApi = (data: unknown) =>
  API.post(`${USER_AUTH}/signup`, data);

export const loginApi = (data: unknown) =>
  API.post(`${USER_AUTH}/login`, data);

export const refreshTokenApi = () =>
  API.get(`${USER_AUTH}/refresh`);

export const logoutApi = () =>
  API.post(`${USER_AUTH}/logout`);

/* ================= PROFILE ================= */
export const getMeApi = () =>
  API.get(`${USER_AUTH}/me`);

export const updateUserApi = (formData: FormData) =>
  API.patch(`${USER_AUTH}/update`, formData);

export const deleteAccountApi = () =>
  API.delete(`${USER_AUTH}/delete`);

/* ================= PASSWORD ================= */
export const forgotPasswordApi = (email: string) =>
  API.post(`${USER_AUTH}/forgot-password`, { email });

export const resetPasswordApi = (data: {
  token: string;
  newPassword: string;
}) =>
  API.post(`${USER_AUTH}/reset-password`, data);

export const updatePasswordApi = (data: {
  currentPassword: string;
  newPassword: string;
}) =>
  API.post(`${USER_AUTH}/update-password`, data);

/* ================= DASHBOARD ================= */
export const getDashboardApi = () =>
  API.get(`${USER_AUTH}/dashboard`);

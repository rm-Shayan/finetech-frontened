import { API } from "../../config/axios";
import type { PaginatedComplaints } from "../features/user/userComplaintSlice";

/* ================= BASE PATH ================= */
const USER_COMPLAINT = "user/complaint";

/* ================= TYPES ================= */
export interface ComplaintQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
/* ================= COMPLAINT ================= */
export const submitComplaintApi = (data: FormData) =>
  API.post(`${USER_COMPLAINT}/submit`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getUserComplaintsApi = (params?: ComplaintQueryParams) =>
  API.get<ApiResponse<PaginatedComplaints>>(`${USER_COMPLAINT}`, { params });


export const getUserComplaintsByIdApi = (id?: string) => {
  if (!id) {
    throw new Error("User ID is required to fetch complaints.");
  }

  return API.get(`${USER_COMPLAINT}/${id}`);
};

export const updateComplaintApi = (id: string, data: FormData) => {
  // Must return the Axios promise
  return API.patch(`${USER_COMPLAINT}/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const closeComplaintApi = (id: string, reason?: string) =>
  API.patch(`${USER_COMPLAINT}/updateStatus/${id}`, { reason });

export const deleteComplaintApi = (id: string) =>
  API.delete(`${USER_COMPLAINT}/delete/${id}`);

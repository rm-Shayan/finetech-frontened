import { API } from "../../config/axios";

/* ================= BASE PATH ================= */
const BANK_OFFICER_COMPLAINT = "Bank_Officer/complaint";

/* ================= TYPES ================= */
export interface GetComplaintsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface UpdateComplaintStatusPayload {
  status: string;
  remark?: string;
}

/* ================= COMPLAINT ================= */
export const getBankOfficerComplaintsApi = (
  params: GetComplaintsParams = {}
) =>
  API.get(`${BANK_OFFICER_COMPLAINT}`, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      status: params.status,
    },
    withCredentials: true,
  });

export const updateComplaintStatusApi = (
  id: string,
  data: UpdateComplaintStatusPayload
) =>
  API.patch(`${BANK_OFFICER_COMPLAINT}/update/${id}`, data, {
    withCredentials: true,
  });

  export const getBankOfficerComplaintsByIdApi = (id?: string) => {
    if (!id) {
      throw new Error("User ID is required to fetch complaints.");
    }
  
    return API.get(`${BANK_OFFICER_COMPLAINT}/${id}`);
  };
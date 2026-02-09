import { API } from "../../config/axios";

/* ================= BASE PATH ================= */
const SBP_ADMIN_COMPLAINT = "sbp_admin/complaint";

/* ================= TYPES ================= */
export interface GetSbpAdminComplaintsParams {
  page?: number;
  limit?: number;
  status?: string;
  bankCode?: string;
  priority?: string;
}

/* ================= COMPLAINT ================= */
export const getAllComplaintBySbpAdminApi = (
  params: GetSbpAdminComplaintsParams = {}
) =>
  API.get(SBP_ADMIN_COMPLAINT, {
    params,
  });


 export const getSbpAdminComplaintsByIdApi = (id?: string) => {
   if (!id) {
     throw new Error("User ID is required to fetch complaints.");
   }
 
   return API.get(`${SBP_ADMIN_COMPLAINT}/${id}`);
 };
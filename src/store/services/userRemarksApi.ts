import { API } from "../../config/axios";
import type { ComplaintRemarksResponse } from "../features/user/userRemarkSlice";


// Wrap the actual API response
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
/* ================= GET REMARKS ================= */
export const getRemarksApi = (params: {
  complaintId?: string;
  complaintNo?: string;
  status?: string;
}) => {
  // Must have complaintId to fetch remarks
  if (!params.complaintId) {
    throw new Error("complaintId is required to fetch remarks");
  }

  // Use complaintId as URL param, others as query
  const query: Record<string, string> = {};
  if (params.complaintNo) query.complaintNo = params.complaintNo;
  if (params.status) query.status = params.status;

  return API.get<ApiResponse<ComplaintRemarksResponse>>(`user/remark/${params.complaintId}`, { params: query });
};

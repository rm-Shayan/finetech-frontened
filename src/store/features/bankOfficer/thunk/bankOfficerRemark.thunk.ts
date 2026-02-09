import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBankOfficerRemarksApi } from "../../../services/bankOfficerRemarks";
import type { ComplaintRemarksResponse } from "../bankOfficerRemarkSlice";

/* ================= GET REMARKS THUNK ================= */
export const getBankOfficerRemarksThunk = createAsyncThunk<
  ComplaintRemarksResponse,
  { complaintId?: string; complaintNo?: string; status?: string },
  { rejectValue: string }
>(
  "bankOfficerRemark/getRemarks",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getBankOfficerRemarksApi(params);
      return data?.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch remarks");
    }
  }
);

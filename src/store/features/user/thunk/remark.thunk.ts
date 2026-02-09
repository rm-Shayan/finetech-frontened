import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRemarksApi } from "../../../services/userRemarksApi";
import type { ComplaintRemarksResponse } from "../userRemarkSlice";

/* ================= GET REMARKS THUNK ================= */
export const getRemarksThunk = createAsyncThunk<
  ComplaintRemarksResponse,
  { complaintId?: string; complaintNo?: string; status?: string },
  { rejectValue: string }
>(
  "remark/getRemarks",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getRemarksApi(params);
      console.log("thunk remark", data);
      return data?.data; // <-- return only the inner `data`
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch remarks");
    }
  }
);


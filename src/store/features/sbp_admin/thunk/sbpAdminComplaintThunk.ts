import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllComplaintBySbpAdminApi,getSbpAdminComplaintsByIdApi } from "../../../services/sbpAdminComplaintApi";
import type {  PaginatedComplaints,FlattenedComplaint } from "../sbp_adminComplaintSlice";

/* ================= TYPES ================= */
type RejectValue = string;


export const getAllComplaintBySbpAdminThunk = createAsyncThunk<
  PaginatedComplaints,
  { page?: number; limit?: number; status?: string; bankCode?: string; search?: string } | undefined,
  { rejectValue: RejectValue }
>("sbpAdmin/complaints/getAll", async (params, { rejectWithValue }) => {
  try {
    const res = await getAllComplaintBySbpAdminApi(params);
    return res.data.data as PaginatedComplaints;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch complaints");
  }
});

/* ================= GET COMPLAINT BY ID ================= */
export const getSbpAdminComplaintsByIdThunk = createAsyncThunk<
  FlattenedComplaint,  // ✅ return type
  string,
  { rejectValue: string }
>(
  "complaint/getById",
  async (id: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await getSbpAdminComplaintsByIdApi(id);
      if (!res?.data?.data) throw new Error("Complaint details not found");

            
     const complaint: FlattenedComplaint = {
  ...res.data.data.complaint, // all fields inside 'complaint'
  remark: res.data.data.remark || null, // include remark separately
};


      return complaint; // ✅ directly FlattenedComplaint
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch complaint details"
      );
    }
  }
);

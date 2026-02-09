import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBankOfficerComplaintsApi, getBankOfficerComplaintsByIdApi, updateComplaintStatusApi } from "../../../services/bankOfficerComplaintApi";
import type { ComplaintType, PaginatedComplaints,FlattenedComplaint } from "../bankOfficerComplaintSlice";

/* ================= TYPES ================= */
type RejectValue = string;

/* ================= GET COMPLAINTS ================= */
export const getBankOfficerComplaintsThunk = createAsyncThunk<
  PaginatedComplaints, 
  { page?: number; limit?: number; status?: string } | undefined, 
  { rejectValue: RejectValue }
>(
  "bankOfficerComplaint/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getBankOfficerComplaintsApi(params);
      return res.data.data as PaginatedComplaints; // backend already sends paginated data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch complaints");
    }
  }
);

/* ================= GET COMPLAINT BY ID ================= */
export const getBankOfficerComplaintsByIdThunk =createAsyncThunk<
  FlattenedComplaint,  // ✅ return type
  string,
  { rejectValue: string }
>(
  "complaint/getById",
  async (id: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await getBankOfficerComplaintsByIdApi(id);
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

/* ================= UPDATE STATUS ================= */
export const updateComplaintStatusThunk = createAsyncThunk<
  { complaint: ComplaintType; remark: any | null }, 
  { id: string; status: string; remark?: string }, 
  { rejectValue: RejectValue }
>(
  "bankOfficerComplaint/updateStatus",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const res = await updateComplaintStatusApi(id, { status, remark });
      return res.data.data; // backend sends { complaint, remark }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update complaint status");
    }
  }
);

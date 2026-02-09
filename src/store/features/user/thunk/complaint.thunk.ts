import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  submitComplaintApi,
  getUserComplaintsApi,
  updateComplaintApi,
  closeComplaintApi,
  deleteComplaintApi,
  getUserComplaintsByIdApi
} from "../../../services/userComplaintApi";
import type { ComplaintType, PaginatedComplaints,FlattenedComplaint } from "../userComplaintSlice";

/* ================= SUBMIT ================= */
export const submitComplaintThunk = createAsyncThunk<
  ComplaintType, // ✅ return type on success
  FormData, // ✅ argument type
  { rejectValue: string } // ✅ type of rejectWithValue
>("complaint/submit", async (data, { rejectWithValue }) => {
  try {
    const res = await submitComplaintApi(data);
    console.log("data via thunk",res?.data?.data)
    return res?.data?.data as ComplaintType;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to submit complaint",
    );
  }
});

/* ================= GET COMPLAINTS ================= */
export const getUserComplaintsThunk = createAsyncThunk<
  PaginatedComplaints, // success type
  | { page?: number; limit?: number; status?: string; priority?: string }
  | undefined, // arg type
  { rejectValue: string }
>("complaint/getUserComplaints", async (params, { rejectWithValue }) => {
  try {
    const res = await getUserComplaintsApi(params);
    if (!res?.data?.data) {
      throw new Error("Invalid response structure");
    }
    return res.data?.data as PaginatedComplaints;
    
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch complaints",
    );
  }
});

/* ================= GET COMPLAINT BY ID ================= */

export const getUserComplaintsByIdThunk = createAsyncThunk<
  FlattenedComplaint,  // ✅ return type
  string,
  { rejectValue: string }
>(
  "complaint/getById",
  async (id: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await getUserComplaintsByIdApi(id);
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



/* ================= UPDATE ================= */
export const updateComplaintThunk = createAsyncThunk<
  ComplaintType,
  { id: string; data: FormData },
  { rejectValue: string }
>(
  "complaint/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Axios call with FormData
      const res = await updateComplaintApi(id, data);
      return res.data.data as ComplaintType;
    } catch (err: any) {
      // Ensure you catch Axios errors
      return rejectWithValue(
        err.response?.data?.message || "Failed to update complaint"
      );
    }
  }
);

/* ================= CLOSE COMPLAINT ================= */
export const closeComplaintThunk = createAsyncThunk<
  { complaint: ComplaintType; remark: any },
  { id: string; reason?: string },
  { rejectValue: string }
>("complaint/closeComplaint", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await closeComplaintApi(id, reason);
    return {
      complaint: res.data.data.sanitizedComplaint,
      remark: res.data.data.sanitizedRemark,
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to close complaint",
    );
  }
});

/* ================= DELETE ================= */
export const deleteComplaintThunk = createAsyncThunk<
  string, // return the deleted complaint id
  string, // argument type
  { rejectValue: string }
>("complaint/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteComplaintApi(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete complaint",
    );
  }
});

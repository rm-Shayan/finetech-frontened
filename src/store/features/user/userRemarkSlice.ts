import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getRemarksThunk } from "./thunk/remark.thunk";

/* ================= TYPES ================= */
export interface RemarkType {
  _id: string;
  complaintId: string;
  actionBy: string;
  actionType: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintRemarksResponse {
  complaintNo: string;
  currentStatus: string;
  totalRemarks: number;
  remarks: RemarkType[];
}

interface RemarkState {
  remarks: RemarkType[];
  loading: boolean;
  error: string | null;
  complaintNo: string | null;
  totalRemarks: number;
  currentStatus: string | null;
}

/* ================= INITIAL STATE ================= */
const initialState: RemarkState = {
  remarks: [],
  loading: false,
  error: null,
  complaintNo: null,
  totalRemarks: 0,
  currentStatus: null,
};

/* ================= SLICE ================= */
const remarkSlice = createSlice({
  name: "remark",
  initialState,
  reducers: {
    clearRemarkState: (state) => {
      state.error = null;
      state.remarks = [];
      state.totalRemarks = 0;
      state.complaintNo = null;
      state.currentStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRemarksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getRemarksThunk.fulfilled,
        (state, action: PayloadAction<ComplaintRemarksResponse>) => {
          state.loading = false;
          state.remarks = action.payload.remarks;
          state.totalRemarks = action.payload.totalRemarks;
          state.complaintNo = action.payload.complaintNo;
          state.currentStatus = action.payload.currentStatus;
        },
      )
      .addCase(getRemarksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRemarkState } = remarkSlice.actions;
export default remarkSlice.reducer;

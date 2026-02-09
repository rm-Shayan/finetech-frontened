import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  submitComplaintThunk,
  getUserComplaintsThunk,
  updateComplaintThunk,
  closeComplaintThunk,
  deleteComplaintThunk,
  getUserComplaintsByIdThunk,
} from "./thunk/complaint.thunk";

export interface ComplaintType {
  _id: string;
  complaintNo: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  attachments: { url: string; public_id: string }[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  remark?: any; // remark object included
}

export interface PaginatedComplaints {
  page: number;
  limit: number;
  count: number;
  filters: { status: string; priority: string };
  complaints: ComplaintType[];
}
export interface FlattenedComplaint extends ComplaintType {
  remark?: any;
}
// ComplaintState
interface ComplaintState {
  complaints: PaginatedComplaints | null;
  loading: boolean;
  error: string | null;
 selectedComplaint: FlattenedComplaint | null;
}


const initialState: ComplaintState = {
  complaints: null,
  loading: false,
  selectedComplaint: null,
  error: null,
};
// Helper
const handlePending = (state: ComplaintState) => {
  state.loading = true;
  state.error = null;
};
const handleRejected = (state: ComplaintState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload as string;
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    clearComplaintError: (state) => {
      state.error = null;
    },
    clearSelectedComplaint: (state) => {
    state.selectedComplaint = null; // 👈 Detail page se bahar aate waqt clean-up
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitComplaintThunk.pending, handlePending)
      .addCase(submitComplaintThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.complaints) {
          state.complaints.complaints.unshift(action.payload);
          state.complaints.count += 1;
        }
      })
      .addCase(submitComplaintThunk.rejected, handleRejected)

      .addCase(getUserComplaintsThunk.pending, handlePending)
      .addCase(getUserComplaintsThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.complaints || action.payload.page === 1) {
          // 🔹 First page / filter change
          state.complaints = action.payload;
        } else {
          // 🔹 Next pages → append
          state.complaints.complaints.push(...action.payload.complaints);
          state.complaints.page = action.payload.page;
        }
      })
      .addCase(getUserComplaintsThunk.rejected, handleRejected)

      .addCase(getUserComplaintsByIdThunk.pending, handlePending)
      .addCase(getUserComplaintsByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("payload action",action.payload)
     state.selectedComplaint = action.payload; // ✅ ab type match
 })
      .addCase(getUserComplaintsByIdThunk.rejected, handleRejected)

      .addCase(updateComplaintThunk.pending, handlePending)
      .addCase(updateComplaintThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.complaints) {
          state.complaints.complaints = state.complaints.complaints.map((c) =>
            c._id === action.payload._id ? action.payload : c,
          );
        }
      })
      .addCase(updateComplaintThunk.rejected, handleRejected)

      .addCase(closeComplaintThunk.pending, handlePending)
      .addCase(closeComplaintThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.complaints) {
          state.complaints.complaints = state.complaints.complaints.map((c) =>
            c._id === action.payload.complaint._id
              ? { ...action.payload.complaint, remark: action.payload.remark }
              : c,
          );
        }
      })
      .addCase(closeComplaintThunk.rejected, handleRejected)

      .addCase(deleteComplaintThunk.pending, handlePending)
      .addCase(deleteComplaintThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.complaints) {
          state.complaints.complaints = state.complaints.complaints.filter(
            (c) => c._id !== action.payload,
          );
          state.complaints.count -= 1;
        }
      })
      .addCase(deleteComplaintThunk.rejected, handleRejected);
  },
});

export const { clearComplaintError,clearSelectedComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;

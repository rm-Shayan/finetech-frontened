import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAllComplaintBySbpAdminThunk,getSbpAdminComplaintsByIdThunk } from "./thunk/sbpAdminComplaintThunk";
import type { UserType } from "../user/userSlice";

/* ================= TYPES ================= */
export interface ComplaintType {
  _id: string;
  complaintNo: string;
  type: string;
  category: string;
  priority: "high" | "medium" | "low"; // Union type for better type checking
  status: "pending" | "resolved" | "closed" | "in_progress";
  description: string;
  attachments: { url: string }[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  resolvedAt?: string;
  // Complaint ke andar user object hai, isliye UserType yahan use hoga
  user: UserType;
  bank: {
    _id: string;
    name: string;
    bankCode: string;
  };
}

export interface PaginatedComplaints {
  totalComplaints: number;
  page: number;
  limit: number;
  totalPages: number;
  complaints: ComplaintType[];
}

export interface FlattenedComplaint extends ComplaintType {
  remark?: any;
}

interface SBPAdminComplaintState {
  paginated: PaginatedComplaints | null;
  loading: boolean;
  error: string | null;
  selectedComplaint: FlattenedComplaint | null;
}

const initialState: SBPAdminComplaintState = {
  paginated: null,
  loading: false,
  error: null,
  selectedComplaint:null,
};

const handlePending = (state: SBPAdminComplaintState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (
  state: SBPAdminComplaintState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};

const sbpAdminComplaintSlice = createSlice({
  name: "sbpAdminComplaint",
  initialState,
  reducers: {
    clearSBPComplaintError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllComplaintBySbpAdminThunk.pending, handlePending);
    builder.addCase(
      getAllComplaintBySbpAdminThunk.fulfilled,
      (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.paginated = action.payload;
        } else {
          state.paginated = {
            ...action.payload,
            complaints: [
              ...(state.paginated?.complaints || []),
              ...action.payload.complaints,
            ],
          };
        }
      },
    );
    builder.addCase(getAllComplaintBySbpAdminThunk.rejected, handleRejected);
    builder.addCase(getSbpAdminComplaintsByIdThunk.pending,handlePending)
    builder.addCase(getSbpAdminComplaintsByIdThunk.fulfilled,(state,action)=>{
 console.log("payload action",action.payload)
     state.selectedComplaint = action.payload; // ✅ ab type match
    })
    builder.addCase(getSbpAdminComplaintsByIdThunk.rejected,handleRejected)
  },
});

export const { clearSBPComplaintError } = sbpAdminComplaintSlice.actions;
export default sbpAdminComplaintSlice.reducer;

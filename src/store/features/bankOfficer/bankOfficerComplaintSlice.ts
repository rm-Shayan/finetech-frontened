import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import { getBankOfficerComplaintsThunk, updateComplaintStatusThunk,getBankOfficerComplaintsByIdThunk } from "./thunk/bankOfficerComplaintThunk";

export interface ComplaintType {
  _id: string;
  complaintNo: string;
  userId: string;
  bankId: string;
  type: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  remark?: any | null;
  in_progressAt?: string;
  resolvedAt?: string;
  rejectedAt?: string;
  escalatedAt?: string;
  [key: string]: any;
}


export interface FlattenedComplaint extends ComplaintType {
  remark?: any;
}

export interface PaginatedComplaints {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  complaints: ComplaintType[];
}

interface BankOfficerComplaintState {
  complaints: ComplaintType[];
  paginated: PaginatedComplaints | null;
  loading: boolean;
  error: string | null;
  selectedComplaint: FlattenedComplaint | null;
}

const initialState: BankOfficerComplaintState = {
  complaints: [],
  paginated: null,
  loading: false,
  error: null,
  selectedComplaint:null,
};

const handlePending = (state: BankOfficerComplaintState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: BankOfficerComplaintState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload as string;
};

const bankOfficerComplaintSlice = createSlice({
  name: "bankOfficerComplaint",
  initialState,
  reducers: {
    clearBankOfficerComplaintError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ================= GET COMPLAINTS ================= */
    builder.addCase(getBankOfficerComplaintsThunk.pending, handlePending);
    builder.addCase(getBankOfficerComplaintsThunk.fulfilled, (state, action) => {
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
      },);
    builder.addCase(getBankOfficerComplaintsThunk.rejected, handleRejected);

    /* ================= UPDATE STATUS ================= */
    builder.addCase(updateComplaintStatusThunk.pending, handlePending);
    builder.addCase(updateComplaintStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      const updatedComplaint = action.payload.complaint;

      // Update in complaints array
      state.complaints = state.complaints.map(c =>
        c._id === updatedComplaint._id ? updatedComplaint : c
      );

      // Update in paginated array if exists
      if (state.paginated) {
        state.paginated.complaints = state.paginated.complaints.map(c =>
          c._id === updatedComplaint._id ? updatedComplaint : c
        );
      }
    });
    builder.addCase(updateComplaintStatusThunk.rejected, handleRejected);
    
        builder.addCase(getBankOfficerComplaintsByIdThunk.pending,handlePending)
        builder.addCase(getBankOfficerComplaintsByIdThunk.fulfilled,(state,action)=>{
          state.loading=false;
     console.log("payload action",action.payload)
         state.selectedComplaint = action.payload; // ✅ ab type match
        })
     builder.addCase(getBankOfficerComplaintsByIdThunk.rejected,handleRejected)
  },
});

export const { clearBankOfficerComplaintError } = bankOfficerComplaintSlice.actions;
export default bankOfficerComplaintSlice.reducer;

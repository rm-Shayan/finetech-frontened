import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getBanksThunk,type BankType } from "./thunk/bankthunk";

interface BankState {
  banks: BankType[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  banks: [],
  loading: false,
  error: null,
};

const handlePending = (state: BankState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: BankState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload as string;
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    clearBankError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBanksThunk.pending, handlePending);
    builder.addCase(getBanksThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.banks = action.payload;
    });
    builder.addCase(getBanksThunk.rejected, handleRejected);
  },
});

export const { clearBankError } = bankSlice.actions;
export default bankSlice.reducer;

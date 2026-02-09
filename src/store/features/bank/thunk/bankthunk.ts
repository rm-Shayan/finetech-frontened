import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBanksApi } from "../../../services/bankApi";

/* ================= TYPES ================= */
export interface BankType {
  _id: string;
  bankName: string;
  bankCode: string;
}

export const getBanksThunk = createAsyncThunk<BankType[], void, { rejectValue: string }>(
  "bank/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBanksApi();
      return res.data.data as BankType[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch banks");
    }
  }
);

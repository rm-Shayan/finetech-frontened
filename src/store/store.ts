// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { loggerMiddleware } from "./logger";

import {
  userReducer,
  userComplaintReducer,
  userRemarksReducer,
} from "./features/user";

import {
  bankOfficerReducer,
  bankOfficerComplaintReducer,
  bankOfficerRemarksReducer,
} from "./features/bankOfficer";

import {
  sbp_adminReducer,
  sbp_adminComplaintReducer,
} from "./features/sbp_admin";

import { bankReducer } from "./features/bank";

/* ================= ROOT REDUCER ================= */
export const store = configureStore({
  reducer: {
    /* ---------- USER ---------- */
    user: userReducer,
    userComplaints: userComplaintReducer,
    userRemarks: userRemarksReducer,

    /* ---------- BANK OFFICER ---------- */
    bankOfficer: bankOfficerReducer,
    bankOfficerComplaints: bankOfficerComplaintReducer,
    bankOfficerRemarks: bankOfficerRemarksReducer,

    /* ---------- SBP ADMIN ---------- */
    sbpAdmin: sbp_adminReducer,
    sbpAdminComplaints:sbp_adminComplaintReducer,

    /* ---------- BANK ---------- */
    banks: bankReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

/* ================= TYPES ================= */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

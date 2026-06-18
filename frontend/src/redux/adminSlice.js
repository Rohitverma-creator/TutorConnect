import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    stats: {},
    sessions: [],
    payments: [],
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    logoutAdmin: (state) => {
      state.admin = null;
    },
  },
});

export const {
  setAdmin,
  setStats,
  setSessions,
  setPayments,
  logoutAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
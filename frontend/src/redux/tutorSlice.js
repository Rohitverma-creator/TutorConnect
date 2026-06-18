import { createSlice } from "@reduxjs/toolkit";

const tutorSlice = createSlice({
  name: "tutor",
  initialState: {
    tutor: null,
    tutors: [],
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTutor: (state, action) => {
      state.tutor = action.payload;
    },
    setTutors: (state, action) => {
      state.tutors = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    cancelBooking: (state, action) => {
      state.bookings = state.bookings.filter((b) => b._id !== action.payload);
    },
    confirmBooking: (state, action) => {
      const booking = state.bookings.find((b) => b._id === action.payload);
      if (booking) {
        booking.status = "confirmed";
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTutor,
  setLoading,
  setTutors,
  setBookings,
  cancelBooking,
  confirmBooking,
  setError,
} = tutorSlice.actions;

export default tutorSlice.reducer;
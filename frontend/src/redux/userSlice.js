import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    myBookings: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },

    setBookings: (state, action) => {
      state.myBookings = action.payload;
    },

    addBooking: (state, action) => {
      const bookingWithStatus = {
        ...action.payload,
        _id: action.payload._id || Date.now().toString(),
        status: "pending",
      };
      state.myBookings.push(bookingWithStatus);
    },

    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.myBookings.find((b) => b._id === id);
      if (booking) booking.status = status;
    },

    cancelBooking: (state, action) => {
      state.myBookings = state.myBookings.filter(
        (b) => b._id !== action.payload,
      );
    },
  },
});

export const { setUserData, setBookings,addBooking, updateBookingStatus, cancelBooking } =
  userSlice.actions;

export default userSlice.reducer;

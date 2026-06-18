import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tutorReducer from "./tutorSlice"
import adminReducer from "./adminSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    tutor: tutorReducer, 
    admin: adminReducer,

  },
});
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/dashboard/DashboardSlice";

const store = configureStore({
  reducer: {
    userState: userReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import summaryReducer from "../features/summarySlice";
import historyReducer from "../features/historySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    summary: summaryReducer,
    history: historyReducer,
  },
});

export default store;

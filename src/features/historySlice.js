import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const saveSummary = createAsyncThunk(
  "history/saveSummary",
  async ({ uid, text, summary }) => {
    const col = collection(db, "history");
    await addDoc(col, {
      uid,
      text,
      summary,
      createdAt: serverTimestamp(),
    });
    return true;
  }
);

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (uid) => {
    const col = collection(db, "history");
    const q = query(
      col,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default historySlice.reducer;

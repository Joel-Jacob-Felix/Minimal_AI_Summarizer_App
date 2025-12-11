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
  async ({ uid, text, summary }, { rejectWithValue }) => {
    try {
      const col = collection(db, "history");
      const docRef = await addDoc(col, {
        uid,
        text,
        summary,
        createdAt: serverTimestamp(),
      });
      console.debug("Saved history doc:", docRef.id);
      return { id: docRef.id };
    } catch (err) {
      console.error("Failed to save history:", err);
      return rejectWithValue(err.message || "Save failed");
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (uid, { rejectWithValue }) => {
    try {
      const col = collection(db, "history");
      const q = query(col, where("uid", "==", uid), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.debug("Fetched history count:", results.length);
      return results;
    } catch (err) {
      console.error("Failed to fetch history:", err);
      return rejectWithValue(err.message || "Fetch failed");
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
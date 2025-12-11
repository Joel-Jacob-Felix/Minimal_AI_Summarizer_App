import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// EXTRACTIVE summarization (no Gemini)
export const generateSummary = createAsyncThunk(
  "summary/generateSummary",
  async (text, { rejectWithValue }) => {
    try {
      // split into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

      // stopwords
      const stopWords = new Set([
        "the","is","in","and","to","a","of","that","for","on","with",
        "as","by","this","it","be","are","was","were","at","from",
        "or", "an", "but", "if", "then", "because", "so", "while"
      ]);

      // word frequency
      const wordFreq = {};
      text
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(w => w && !stopWords.has(w))
        .forEach(word => {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

      // score sentences
      const scored = sentences.map(sentence => {
        const words = sentence.toLowerCase().split(/\s+/);
        let score = 0;
        words.forEach(w => {
          if (wordFreq[w]) score += wordFreq[w];
        });
        return { sentence, score };
      });

      scored.sort((a, b) => b.score - a.score);

      const takeN = Math.max(3, Math.floor(sentences.length * 0.3));

      const summary = scored
        .slice(0, takeN)
        .map(s => s.sentence.trim())
        .join(" ");

      return summary || "Could not summarize";
    } catch (err) {
      console.log(err);
      return rejectWithValue("Summary failed");
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    text: "",
    summary: "",
    loading: false,
    error: null,
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    clearSummary: (state) => {
      state.summary = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setText, clearSummary } = summarySlice.actions;
export default summarySlice.reducer;

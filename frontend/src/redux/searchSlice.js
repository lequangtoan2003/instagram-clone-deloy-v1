import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchOpen: false,
  },
  reducers: {
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
  },
});

export const { setSearchOpen } = searchSlice.actions;
export default searchSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

const initialState: LoadingState = {
  isLoading: false,
  message: undefined,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.message = action.payload;
    },
    hideLoader: (state) => {
      state.isLoading = false;
      state.message = undefined;
    },
  },
});

export const { showLoader, hideLoader } = loadingSlice.actions;
export default loadingSlice.reducer;
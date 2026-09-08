import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalStatus = "success" | "error" | "warning" | "info";

export interface ResponseModalState {
  isOpen: boolean;
  status: ModalStatus;
  title?: string;
  message?: string;
  buttonText?: string;
  onConfirm?: () => void;
}

const initialState: ResponseModalState = {
  isOpen: false,
  status: "success",
  title: undefined,
  message: undefined,
  buttonText: "OK",
  onConfirm: undefined,
};

export const responseModalSlice = createSlice({
  name: "responseModal",
  initialState,
  reducers: {
    showResponseModal: (
      state,
      action: PayloadAction<{
        status: ModalStatus;
        title?: string;
        message?: string;
        buttonText?: string;
        onConfirm?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.status = action.payload.status;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.buttonText = action.payload.buttonText || "OK";
      state.onConfirm = action.payload.onConfirm;
    },
    hideResponseModal: (state) => {
      state.isOpen = false;
      state.title = undefined;
      state.message = undefined;
      state.onConfirm = undefined;
    },
  },
});

export const { showResponseModal, hideResponseModal } = responseModalSlice.actions;
export default responseModalSlice.reducer;
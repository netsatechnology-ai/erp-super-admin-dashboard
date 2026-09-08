import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import loadingReducer from "./slices/loadingSlice";
import responseModalReducer from "./slices/responseModalSlice";
export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    responseModal: responseModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
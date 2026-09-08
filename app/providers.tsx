"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { GlobalLoader } from "@/components/layout/GlobalLoader";
import { ResponseModal } from "@/components/layout/ResponseModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <GlobalLoader />
      <ResponseModal />
    </Provider>
  );
}
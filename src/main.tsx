import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CustomToaster from "@/components/ui/Toaster.tsx";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/Router.tsx";
import { Provider } from "react-redux";
import store from "@/redux/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryProvider } from "./context/QueryProvider.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;


let persistor = persistStore(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>

    <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CustomToaster />
        <RouterProvider router={Router} />
      </PersistGate>
      </Provider>
      </GoogleOAuthProvider>
    </QueryProvider>
      
  </StrictMode>
);

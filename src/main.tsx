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
import { QueryProvider } from "./contexts/QueryProvider.tsx";

import { SocketManager } from "@/components/socket/SocketManager";
import { NotificationProvider } from "./contexts/NotificationContext.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

let persistor = persistStore(store);

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <NotificationProvider>
          <PersistGate persistor={persistor}>
            <SocketManager />
            <CustomToaster />
            <RouterProvider router={Router} />
          </PersistGate>
        </NotificationProvider>
      </Provider>
    </GoogleOAuthProvider>
  </QueryProvider>
);

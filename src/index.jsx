import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";
import CommunicationProvider from "./providers/Communication";
import SynchronizationProvider from "./providers/Synchronization";

const root = createRoot(document.getElementById("root"));

root.render(
  <Suspense fallback={<div id="sus-fallback"></div>}>
    <Provider store={store}>
      <CommunicationProvider>
        <SynchronizationProvider>
          <App />
        </SynchronizationProvider>
      </CommunicationProvider>
    </Provider>
  </Suspense>
);

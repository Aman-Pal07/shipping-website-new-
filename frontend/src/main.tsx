import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </Provider>
  </React.StrictMode>
);

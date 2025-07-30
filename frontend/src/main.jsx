import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./App.jsx";

import { ActiveSectionProvider } from "./contexts/ActiveSectionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ActiveSectionProvider>
      <App />
    </ActiveSectionProvider>
  </StrictMode>
);

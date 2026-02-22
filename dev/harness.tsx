import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { HarnessApp } from "./harness-app";

import "@/styles/globals.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <HarnessApp />
  </StrictMode>,
);

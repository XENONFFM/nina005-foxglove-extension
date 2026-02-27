import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Harness } from "./harness";

import "@/styles/globals.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);

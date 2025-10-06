import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>
);

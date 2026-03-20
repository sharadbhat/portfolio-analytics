import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dropzone/styles.css";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "portfolio-analytics-color-scheme",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider
      theme={{ primaryColor: "teal" }}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="light"
    >
      <App />
    </MantineProvider>
  </StrictMode>,
);

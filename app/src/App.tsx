import { useState } from "react";
import { Anchor, Box, Stack, Text } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import HeroSection from "./components/HeroSection";
import PortfolioUploadPanel from "./components/PortfolioUploadPanel";
import { sampleCsvs } from "./data/sampleCsvs";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleDrop = (files: FileWithPath[]) => {
    setSelectedFile(files[0] ?? null);
    setFileError(null);
  };

  const handleReject = () => {
    setSelectedFile(null);
    setFileError("Please upload a CSV file under 5 MB.");
  };

  return (
    <Box className="app-shell">
      <Stack className="app-stack" gap="xl">
        <HeroSection />
        <PortfolioUploadPanel
          selectedFile={selectedFile}
          fileError={fileError}
          samples={sampleCsvs}
          onDrop={handleDrop}
          onReject={handleReject}
        />
        <Text size="sm" c="dimmed" ta="right" className="page-attribution">
          <Anchor
            href="https://www.flaticon.com/free-icons/stocks"
            title="stocks icons"
            target="_blank"
            rel="noreferrer"
          >
            Stocks icons created by Boris farias - Flaticon
          </Anchor>
        </Text>
      </Stack>
    </Box>
  );
}

export default App;

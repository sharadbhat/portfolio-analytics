import { Button, Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { usePortfolioUploadStore } from "../store/portfolioUploadStore";

function UploadCtaSection() {
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const { selectedFile, analyzePortfolio } = usePortfolioUploadStore();

  const showSelectionHint = hasTriedSubmit && !selectedFile;
  const isReady = Boolean(selectedFile);

  const handleSubmit = () => {
    if (selectedFile?.name) {
      setHasTriedSubmit(false);
      analyzePortfolio();
      return;
    }

    setHasTriedSubmit(true);
  };

  return (
    <Stack align="center" gap="xs" className="upload-cta-wrap">
      <Group justify="center" align="center" className="upload-status">
        <Button
          size="md"
          radius="xl"
          onClick={handleSubmit}
          variant={isReady ? "gradient" : "light"}
          gradient={{ from: "#12b886", to: "#0b7285", deg: 135 }}
          className={isReady ? "analyze-cta" : ""}
          style={{ minWidth: "360px", maxWidth: "100%" }}
        >
          Analyze Portfolio
        </Button>
      </Group>

      {showSelectionHint ? (
        <Text size="sm" c="red" ta="center">
          Please select a file first.
        </Text>
      ) : null}
    </Stack>
  );
}

export default UploadCtaSection;

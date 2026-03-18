import { Divider, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconFileText, IconUpload } from "@tabler/icons-react";
import type { SampleCsv } from "../types/portfolio";
import { usePortfolioUploadStore } from "../store/portfolioUploadStore";
import SampleCsvSection from "./SampleCsvSection";
import UploadCtaSection from "./UploadCtaSection";

type PortfolioUploadPanelProps = {
  samples: SampleCsv[];
};

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 ** 2) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 ** 2).toFixed(2)} MB`;
}

function PortfolioUploadPanel({ samples }: PortfolioUploadPanelProps) {
  const { selectedFile, handleDrop, handleReject } = usePortfolioUploadStore();

  return (
    <Paper radius="xl" shadow="xl" p="xl" className="upload-panel">
      <Stack gap="lg">
        <Dropzone
          onDrop={handleDrop}
          onReject={handleReject}
          accept={[MIME_TYPES.csv, "text/csv"]}
          maxSize={5 * 1024 ** 2}
          multiple={false}
          className={`dropzone ${selectedFile ? "dropzone-ready" : "dropzone-prompt"}`}
        >
          <Stack align="center" gap="sm" py="xl">
            <ThemeIcon size={64} radius="xl" variant="light" color="teal">
              {selectedFile ? (
                <IconFileText size={32} />
              ) : (
                <IconUpload size={32} />
              )}
            </ThemeIcon>

            {selectedFile ? (
              <>
                <Text fw={700} size="lg" ta="center">
                  {selectedFile.name}
                </Text>
                <Text c="dimmed" ta="center">
                  CSV selected - {formatFileSize(selectedFile.size)}
                </Text>
                <Text c="dimmed" size="sm" ta="center" maw={520}>
                  Click or drop another file here if you want to replace it.
                </Text>
              </>
            ) : (
              <>
                <Text fw={700} size="lg" ta="center">
                  Drag your portfolio CSV here or click to browse
                </Text>
                <Text c="dimmed" ta="center" maw={520}>
                  We&apos;ll use the uploaded file to calculate portfolio
                  quality metrics and summarize strengths, concentration risks,
                  and diversification gaps.
                </Text>
              </>
            )}
          </Stack>
        </Dropzone>

        <UploadCtaSection />

        <Divider />

        <SampleCsvSection samples={samples} />
      </Stack>
    </Paper>
  );
}

export default PortfolioUploadPanel;

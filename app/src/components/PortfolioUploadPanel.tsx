import { Divider, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import type { FileWithPath } from "@mantine/dropzone";
import type { SampleCsv } from "../types/portfolio";
import SampleCsvSection from "./SampleCsvSection";
import UploadStatus from "./UploadStatus";

type PortfolioUploadPanelProps = {
  selectedFile: FileWithPath | null;
  fileError: string | null;
  samples: SampleCsv[];
  onDrop: (files: FileWithPath[]) => void;
  onReject: () => void;
};

function PortfolioUploadPanel({
  selectedFile,
  fileError,
  samples,
  onDrop,
  onReject,
}: PortfolioUploadPanelProps) {
  return (
    <Paper radius="xl" shadow="xl" p="xl" className="upload-panel">
      <Stack gap="lg">
        <Dropzone
          onDrop={onDrop}
          onReject={onReject}
          accept={[MIME_TYPES.csv, "text/csv"]}
          maxSize={5 * 1024 ** 2}
          multiple={false}
          className="dropzone"
        >
          <Stack align="center" gap="sm" py="xl">
            <ThemeIcon size={64} radius="xl" variant="light" color="teal">
              <IconUpload size={32} />
            </ThemeIcon>
            <Text fw={700} size="lg" ta="center">
              Drag your portfolio CSV here or click to browse
            </Text>
            <Text c="dimmed" ta="center" maw={520}>
              We&apos;ll use the uploaded file to calculate portfolio quality
              metrics and summarize strengths, concentration risks, and
              diversification gaps.
            </Text>
          </Stack>
        </Dropzone>

        <UploadStatus
          selectedFileName={selectedFile?.name}
          errorMessage={fileError}
        />

        <Divider />

        <SampleCsvSection samples={samples} />
      </Stack>
    </Paper>
  );
}

export default PortfolioUploadPanel;

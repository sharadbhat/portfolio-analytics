import { Box, Button, Group, Text } from "@mantine/core";

type UploadStatusProps = {
  selectedFileName?: string;
  errorMessage?: string | null;
};

function UploadStatus({
  selectedFileName,
  errorMessage,
}: UploadStatusProps) {
  return (
    <Group justify="space-between" align="center" className="upload-status">
      <Box>
        <Text fw={600}>Selected file</Text>
        <Text c={errorMessage ? "red" : "dimmed"}>
          {errorMessage ?? selectedFileName ?? "No file selected yet"}
        </Text>
      </Box>
      <Button size="md" radius="xl">
        Analyze Portfolio
      </Button>
    </Group>
  );
}

export default UploadStatus;

import { Badge, Box, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { usePortfolioUploadStore } from "../store/portfolioUploadStore";
import type { SampleCsv } from "../types/portfolio";

type SampleCsvCardProps = {
  sample: SampleCsv;
};

function SampleCsvCard({ sample }: SampleCsvCardProps) {
  const isSubmitting = usePortfolioUploadStore((state) => state.isSubmitting);
  const analyzeSampleCsv = usePortfolioUploadStore((state) => state.analyzeSampleCsv);

  return (
    <Paper radius="lg" p="lg" withBorder className="sample-card">
      <Stack justify="space-between" h="100%">
        <Box>
          <Group justify="space-between" align="flex-start" mb="sm">
            <Text fw={700} size="lg">
              {sample.title}
            </Text>
            <Badge variant="light" color="gray">
              {sample.holdings}
            </Badge>
          </Group>
          <Text c="dimmed">{sample.description}</Text>
        </Box>

        <Button
          onClick={() => {
            void analyzeSampleCsv(sample);
          }}
          variant="light"
          radius="xl"
          loading={isSubmitting}
        >
          Analyze
        </Button>
      </Stack>
    </Paper>
  );
}

export default SampleCsvCard;

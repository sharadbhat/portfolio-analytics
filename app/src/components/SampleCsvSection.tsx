import { Box, SimpleGrid, Stack, Text } from "@mantine/core";
import type { SampleCsv } from "../types/portfolio";
import SampleCsvCard from "./SampleCsvCard";

type SampleCsvSectionProps = {
  samples: SampleCsv[];
};

function SampleCsvSection({ samples }: SampleCsvSectionProps) {
  return (
    <Stack gap="lg">
      <Box>
        <Text c="dimmed" mt="xs">
          Or use a sample dataset to explore the scoring flow before uploading
          your own portfolio.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {samples.map((sample) => (
          <SampleCsvCard key={sample.title} sample={sample} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default SampleCsvSection;

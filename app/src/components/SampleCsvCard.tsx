import { Badge, Box, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useState } from "react";
import type { SampleCsv } from "../types/portfolio";

type SampleCsvCardProps = {
  sample: SampleCsv;
};

function SampleCsvCard({ sample }: SampleCsvCardProps) {
  const [loading, setLoading] = useState(false);
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
          onClick={() => setLoading(true)}
          variant="light"
          radius="xl"
          loading={loading}
        >
          Use
        </Button>
      </Stack>
    </Paper>
  );
}

export default SampleCsvCard;

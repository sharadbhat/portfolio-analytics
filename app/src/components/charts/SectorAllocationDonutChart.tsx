import { Box, Group, Stack, Text, getThemeColor, useMantineTheme } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { percentFormatter } from "./chartFormatters";

type SectorAllocationDonutChartProps = {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
};

function SectorAllocationDonutChart({
  data,
}: SectorAllocationDonutChartProps) {
  const theme = useMantineTheme();

  return (
    <Stack gap="lg" align="center">
      <Box w={320} h={320} maw="100%">
        <DonutChart
          data={data}
          size={240}
          thickness={28}
          chartLabel="Sectors"
          tooltipDataSource="segment"
          valueFormatter={(value) => percentFormatter.format(value / 100)}
          w="100%"
          h="100%"
          mx="auto"
        />
      </Box>

      <div className="sector-donut-legend">
        {data.map((item) => (
          <Group
            key={item.name}
            justify="space-between"
            gap="sm"
            wrap="nowrap"
            className="sector-donut-legend-item"
          >
            <Group gap="xs" wrap="nowrap">
              <Box
                w={10}
                h={10}
                style={{
                  borderRadius: "999px",
                  backgroundColor: getThemeColor(item.color, theme),
                  flexShrink: 0,
                }}
              />
              <Text size="sm" fw={600}>
                {item.name}
              </Text>
            </Group>

            <Text size="sm" c="dimmed" fw={600}>
              {percentFormatter.format(item.value / 100)}
            </Text>
          </Group>
        ))}
      </div>
    </Stack>
  );
}

export default SectorAllocationDonutChart;

import { LineChart } from "@mantine/charts";
import { Paper, Stack, Text } from "@mantine/core";
import { getChartLabel, getTooltipDateLabel, percentFormatter } from "./chartFormatters";

type DrawdownChartProps = {
  data: Array<{
    date: string;
    drawdown: number;
  }>;
};

type PercentageTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<{
    value?: unknown;
    name?: unknown;
    color?: string;
  }>;
};

function PercentageTooltip({
  active,
  label,
  payload,
}: PercentageTooltipProps) {
  if (!active || !label || !payload?.length) {
    return null;
  }

  const value =
    typeof payload[0]?.value === "number"
      ? payload[0].value
      : typeof payload[0]?.value === "string"
        ? Number(payload[0].value)
        : undefined;

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return (
    <Paper withBorder radius="md" p="sm" shadow="sm">
      <Stack gap={4}>
        <Text size="sm">{getTooltipDateLabel(label)}</Text>
        <Text size="sm" fw={700} c={payload[0]?.color ?? "red.6"}>
          {percentFormatter.format(value / 100)}
        </Text>
      </Stack>
    </Paper>
  );
}

function DrawdownChart({ data }: DrawdownChartProps) {
  return (
    <LineChart
      h={300}
      data={data}
      dataKey="date"
      series={[{ name: "drawdown", label: "Drawdown", color: "red.6" }]}
      curveType="monotone"
      withDots
      dotProps={{ r: 0, strokeWidth: 0 }}
      activeDotProps={{ r: 6, strokeWidth: 2 }}
      strokeWidth={2.5}
      gridAxis="xy"
      tickLine="x"
      valueFormatter={(value) => percentFormatter.format(value / 100)}
      tooltipProps={{
        position: { y: 180 },
        cursor: {
          stroke: "rgba(148, 163, 184, 0.65)",
          strokeWidth: 1,
        },
        content: ({ active, label, payload }) => (
          <PercentageTooltip
            active={active}
            label={typeof label === "string" ? label : undefined}
            payload={payload}
          />
        ),
      }}
      xAxisProps={{
        interval: "equidistantPreserveStart",
        minTickGap: 32,
        tickFormatter: (value) =>
          typeof value === "string" ? getChartLabel(value) : `${value}`,
      }}
      referenceLines={[{ y: 0, color: "gray.5" }]}
    />
  );
}

export default DrawdownChart;

import { BarChart } from "@mantine/charts";
import { Paper, Stack, Text } from "@mantine/core";
import { currencyFormatter, getChartLabel, getTooltipDateLabel } from "./chartFormatters";

type DailyPlBarChartProps = {
  data: Array<{
    date: string;
    pl: number;
  }>;
};

type PerformanceTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<{
    value?: unknown;
    payload?: { pl?: number };
  }>;
};

function PerformanceTooltip({
  active,
  label,
  payload,
}: PerformanceTooltipProps) {
  if (!active || !label || !payload?.length) {
    return null;
  }

  const rawValue = payload[0]?.value ?? payload[0]?.payload?.pl;
  const value =
    typeof rawValue === "number"
      ? rawValue
      : typeof rawValue === "string"
        ? Number(rawValue)
        : undefined;

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  const directionSymbol = value >= 0 ? "\u25B2" : "\u25BC";
  const absoluteValue = Math.abs(value);

  return (
    <Paper withBorder radius="md" p="sm" shadow="sm">
      <Stack gap={2}>
        <Text size="sm">{getTooltipDateLabel(label)}</Text>
        <Text size="sm" fw={700} c={value >= 0 ? "teal.6" : "red.6"}>
          {`${directionSymbol} ${currencyFormatter.format(absoluteValue)}`}
        </Text>
      </Stack>
    </Paper>
  );
}

function DailyPlBarChart({ data }: DailyPlBarChartProps) {
  return (
    <BarChart
      h={320}
      data={data}
      dataKey="date"
      series={[{ name: "pl", label: "Daily P/L", color: "teal" }]}
      type="default"
      getBarColor={(value) => (value >= 0 ? "teal.6" : "red.6")}
      gridAxis="xy"
      tickLine="x"
      valueFormatter={(value) => currencyFormatter.format(value)}
      tooltipProps={{
        content: ({ active, label, payload }) => (
          <PerformanceTooltip
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

export default DailyPlBarChart;

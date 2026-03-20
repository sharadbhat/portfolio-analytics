import { LineChart } from "@mantine/charts";
import { Paper, Stack, Text } from "@mantine/core";
import { getChartLabel, getTooltipDateLabel, percentFormatter } from "./chartFormatters";

type PortfolioBenchmarkChartProps = {
  data: Array<{
    date: string;
    portfolio: number;
    benchmark: number | null;
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

  const rows = payload
    .map((item) => {
      const value =
        typeof item.value === "number"
          ? item.value
          : typeof item.value === "string"
            ? Number(item.value)
            : undefined;

      if (typeof value !== "number" || Number.isNaN(value)) {
        return null;
      }

      const rawName =
        typeof item.name === "string" ? item.name : String(item.name ?? "");

      return {
        name: rawName === "portfolio" ? "Portfolio" : rawName === "benchmark" ? "Benchmark" : rawName,
        color: item.color ?? "currentColor",
        value,
      };
    })
    .filter(
      (item): item is { name: string; color: string; value: number } =>
        item !== null,
    );

  if (rows.length === 0) {
    return null;
  }

  return (
    <Paper withBorder radius="md" p="sm" shadow="sm">
      <Stack gap={4}>
        <Text size="sm">{getTooltipDateLabel(label)}</Text>
        {rows.map((row) => (
          <Text key={row.name} size="sm" fw={700} c={row.color}>
            {`${row.name}: ${percentFormatter.format(row.value / 100)}`}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
}

function PortfolioBenchmarkChart({ data }: PortfolioBenchmarkChartProps) {
  return (
    <LineChart
      h={320}
      data={data}
      dataKey="date"
      series={[
        { name: "portfolio", label: "Portfolio", color: "teal" },
        { name: "benchmark", label: "Benchmark", color: "gray.6" },
      ]}
      curveType="monotone"
      withDots
      dotProps={{ r: 0, strokeWidth: 0 }}
      activeDotProps={{ r: 6, strokeWidth: 2 }}
      strokeWidth={2.5}
      gridAxis="xy"
      tickLine="x"
      valueFormatter={(value) => percentFormatter.format(value / 100)}
      tooltipProps={{
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

export default PortfolioBenchmarkChart;

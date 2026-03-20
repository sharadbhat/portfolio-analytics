import { Paper, Stack, Text, Title } from "@mantine/core";
import DailyPlBarChart from "./charts/DailyPlBarChart";
import DrawdownChart from "./charts/DrawdownChart";
import PortfolioBenchmarkChart from "./charts/PortfolioBenchmarkChart";
import {
  currencyFormatter,
  formatSeriesDate,
  getChartLabel,
  percentFormatter,
} from "./charts/chartFormatters";
import type { PerformanceAnalytics } from "../types/portfolio";

type PerformanceOverviewSectionProps = {
  performance: PerformanceAnalytics;
};

function getLastSeriesValue(series: Record<string, number>) {
  const entries = Object.entries(series);

  if (entries.length === 0) {
    return null;
  }

  return entries[entries.length - 1][1];
}

function PerformanceOverviewSection({
  performance,
}: PerformanceOverviewSectionProps) {
  const latestPortfolioValue = getLastSeriesValue(performance.portfolio_perf);
  const latestBenchmarkValue = getLastSeriesValue(performance.benchmark_perf);
  const portfolioGrowth =
    latestPortfolioValue === null ? null : latestPortfolioValue - 1;
  const benchmarkGrowth =
    latestBenchmarkValue === null ? null : latestBenchmarkValue - 1;
  const excessReturn =
    portfolioGrowth === null || benchmarkGrowth === null
      ? null
      : portfolioGrowth - benchmarkGrowth;

  const dailyPlEntries = Object.entries(performance.daily_pl_series).sort(
    ([leftDate], [rightDate]) =>
      formatSeriesDate(leftDate).localeCompare(formatSeriesDate(rightDate)),
  );
  const portfolioPerfEntries = Object.entries(performance.portfolio_perf).sort(
    ([leftDate], [rightDate]) =>
      formatSeriesDate(leftDate).localeCompare(formatSeriesDate(rightDate)),
  );
  const benchmarkPerfEntries = Object.entries(performance.benchmark_perf).sort(
    ([leftDate], [rightDate]) =>
      formatSeriesDate(leftDate).localeCompare(formatSeriesDate(rightDate)),
  );

  const dailyPlChartData = dailyPlEntries.map(([date, value]) => ({
    date: formatSeriesDate(date),
    pl: value,
  }));

  const benchmarkByDate = new Map(
    benchmarkPerfEntries.map(([date, value]) => [
      formatSeriesDate(date),
      value,
    ]),
  );
  const growthChartData = portfolioPerfEntries.map(([date, value]) => {
    const normalizedDate = formatSeriesDate(date);
    const benchmarkValue = benchmarkByDate.get(normalizedDate);

    return {
      date: normalizedDate,
      portfolio: (value - 1) * 100,
      benchmark:
        typeof benchmarkValue === "number" ? (benchmarkValue - 1) * 100 : null,
    };
  });

  let runningPeak = Number.NEGATIVE_INFINITY;
  const drawdownChartData = portfolioPerfEntries.map(([date, value]) => {
    runningPeak = Math.max(runningPeak, value);

    return {
      date: formatSeriesDate(date),
      drawdown: runningPeak > 0 ? (value / runningPeak - 1) * 100 : 0,
    };
  });

  const bestDay = dailyPlEntries.reduce<[string, number] | null>(
    (best, current) => (best === null || current[1] > best[1] ? current : best),
    null,
  );
  const worstDay = dailyPlEntries.reduce<[string, number] | null>(
    (worst, current) =>
      worst === null || current[1] < worst[1] ? current : worst,
    null,
  );

  const performanceCards = [
    {
      label: "Annualized Return",
      value: percentFormatter.format(performance.annualized_return),
      description:
        "Estimated yearly return rate based on the portfolio's performance path.",
    },
    {
      label: "Portfolio Growth",
      value:
        portfolioGrowth === null
          ? "-"
          : percentFormatter.format(portfolioGrowth),
      description:
        "Total cumulative return for the portfolio over the measured period.",
    },
    {
      label: "Benchmark Growth",
      value:
        benchmarkGrowth === null
          ? "-"
          : percentFormatter.format(benchmarkGrowth),
      description:
        "Total cumulative return for the benchmark over the same period.",
    },
    {
      label: "Excess Return",
      value:
        excessReturn === null ? "-" : percentFormatter.format(excessReturn),
      description:
        "How much the portfolio outperformed or lagged the benchmark overall.",
    },
    {
      label: "Alpha",
      value: percentFormatter.format(performance.portolio_alpha),
      description:
        "Return generated beyond what market exposure alone would typically explain.",
    },
    {
      label: "Tracking Error",
      value: percentFormatter.format(performance.tracking_error),
      description:
        "How tightly or loosely the portfolio's returns moved relative to the benchmark.",
    },
  ];

  return (
    <Paper radius="xl" shadow="xl" p="xl" className="results-panel">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2}>Performance Overview</Title>
          <Text c="dimmed" maw={720}>
            Compare portfolio growth against the benchmark and see whether your
            returns came from broad market exposure or true outperformance.
          </Text>
        </Stack>

        <div className="performance-metrics-grid">
          {performanceCards.map((card) => (
            <Paper
              key={card.label}
              withBorder
              radius="lg"
              p="lg"
              className="holdings-summary-card"
            >
              <Stack gap="xs">
                <Text size="lg" fw={700}>
                  {card.label}
                </Text>
                <Text fw={700} size="xl">
                  {card.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {card.description}
                </Text>
              </Stack>
            </Paper>
          ))}
        </div>

        <Stack gap="md">
          <Stack gap={4}>
            <Title order={3}>Portfolio vs Benchmark</Title>
            <Text c="dimmed">
              Compare your cumulative portfolio growth against the benchmark
              over the same period.
            </Text>
          </Stack>

          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card performance-chart-card"
          >
            <PortfolioBenchmarkChart data={growthChartData} />
          </Paper>
        </Stack>

        <Stack gap="md">
          <Stack gap={4}>
            <Title order={3}>Drawdown Over Time</Title>
            <Text c="dimmed">
              See how far the portfolio fell from its previous peak at each
              point along the way.
            </Text>
          </Stack>

          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card performance-chart-card"
          >
            <DrawdownChart data={drawdownChartData} />
          </Paper>
        </Stack>

        <Stack gap="md">
          <Stack gap={4}>
            <Title order={3}>Daily P/L Trend</Title>
            <Text c="dimmed">
              Track how portfolio profit and loss evolved day by day across the
              measured period.
            </Text>
          </Stack>

          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card performance-chart-card"
          >
            <DailyPlBarChart data={dailyPlChartData} />
          </Paper>

          <div className="daily-pl-summary-grid">
            <Paper
              withBorder
              radius="lg"
              p="lg"
              className="holdings-summary-card"
            >
              <Stack gap="xs">
                <Text size="lg" fw={700}>
                  Best Day
                </Text>
                <Text fw={700} size="xl">
                  {bestDay ? currencyFormatter.format(bestDay[1]) : "-"}
                </Text>
                <Text size="sm" c="dimmed">
                  {bestDay
                    ? getChartLabel(bestDay[0])
                    : "No daily data available."}
                </Text>
              </Stack>
            </Paper>

            <Paper
              withBorder
              radius="lg"
              p="lg"
              className="holdings-summary-card"
            >
              <Stack gap="xs">
                <Text size="lg" fw={700}>
                  Worst Day
                </Text>
                <Text fw={700} size="xl">
                  {worstDay ? currencyFormatter.format(worstDay[1]) : "-"}
                </Text>
                <Text size="sm" c="dimmed">
                  {worstDay
                    ? getChartLabel(worstDay[0])
                    : "No daily data available."}
                </Text>
              </Stack>
            </Paper>
          </div>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default PerformanceOverviewSection;

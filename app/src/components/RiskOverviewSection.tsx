import { Paper, Stack, Text, Title } from "@mantine/core";
import type { RiskAnalytics } from "../types/portfolio";

type RiskOverviewSectionProps = {
  risk: RiskAnalytics;
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const riskCards = [
  {
    key: "portfolio_var",
    label: "Value at Risk",
    description: "Estimated downside threshold for a typical bad day.",
    interpretation:
      "Closer to 0% is best. There is no positive upside target here because this metric measures loss.",
    format: percentFormatter,
  },
  {
    key: "portfolio_cvar",
    label: "Conditional VaR",
    description: "Average loss when returns fall beyond the VaR cutoff.",
    interpretation:
      "Closer to 0% is best. Less negative tail loss means the portfolio tends to hold up better in stress periods.",
    format: percentFormatter,
  },
  {
    key: "portfolio_max_drawdown",
    label: "Max Drawdown",
    description: "Largest peak-to-trough decline observed in the period.",
    interpretation:
      "Closer to 0% is best. A shallower drawdown means less severe decline from the portfolio's peak.",
    format: percentFormatter,
  },
  {
    key: "sharpe_ratio",
    label: "Sharpe Ratio",
    description: "Return earned per unit of total volatility taken.",
    interpretation:
      "Higher is better. Around 1 is decent, around 2 is strong, and 3+ is excellent.",
    format: numberFormatter,
  },
  {
    key: "sortino_ratio",
    label: "Sortino Ratio",
    description: "Return earned per unit of downside volatility taken.",
    interpretation:
      "Higher is better. Around 1 is decent, around 2 is strong, and 3+ is excellent.",
    format: numberFormatter,
  },
] as const satisfies ReadonlyArray<{
  key: keyof RiskAnalytics;
  label: string;
  description: string;
  interpretation: string;
  format: Intl.NumberFormat;
}>;

function RiskOverviewSection({ risk }: RiskOverviewSectionProps) {
  const firstRowCards = riskCards.slice(0, 3);
  const secondRowCards = riskCards.slice(3);

  const renderRiskCard = (card: (typeof riskCards)[number]) => (
    <Paper
      key={card.key}
      withBorder
      radius="lg"
      p="lg"
      className="holdings-summary-card"
    >
      <Stack h="100%" justify="space-between" gap="lg">
        <Stack gap="xs">
          <Text size="lg" fw={700}>
            {card.label}
          </Text>
          <Text size="sm" c="dimmed">
            {card.description}
          </Text>
          <Text fw={700} size="xl" mt={6}>
            {card.format.format(risk[card.key])}
          </Text>
        </Stack>
        <Text size="xs" c="dimmed">
          {card.interpretation}
        </Text>
      </Stack>
    </Paper>
  );

  return (
    <Paper radius="xl" shadow="xl" p="xl" className="results-panel">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2}>Risk Overview</Title>
          <Text c="dimmed" maw={720}>
            Review downside risk, drawdown behavior, and risk-adjusted return
            measures to understand how sturdy this portfolio looks under stress.
          </Text>
        </Stack>

        <div className="risk-metrics-grid risk-metrics-grid-top">
          {firstRowCards.map(renderRiskCard)}
        </div>

        <div className="risk-metrics-grid risk-metrics-grid-bottom">
          {secondRowCards.map(renderRiskCard)}
        </div>
      </Stack>
    </Paper>
  );
}

export default RiskOverviewSection;

import {
  Badge,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import type { PortfolioAllocationRow } from "../types/portfolio";

type HoldingsBreakdownSectionProps = {
  rows: PortfolioAllocationRow[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function HoldingsBreakdownSection({ rows }: HoldingsBreakdownSectionProps) {
  const sortedRows = [...rows].sort(
    (left, right) => right["Amount Invested"] - left["Amount Invested"],
  );
  const totalInvested = sortedRows.reduce(
    (sum, row) => sum + row["Amount Invested"],
    0,
  );
  const topHolding = sortedRows[0];

  return (
    <Paper radius="xl" shadow="xl" p="xl" className="results-panel">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" gap="md">
          <Stack gap={4}>
            <Title order={2}>Holdings Breakdown</Title>
            <Text c="dimmed" maw={720}>
              Review your current positions, portfolio weights, and biggest
              concentrations before we layer in performance and risk insights.
            </Text>
          </Stack>

          <Badge variant="light" color="teal" size="lg" radius="xl">
            {sortedRows.length} holdings
          </Badge>
        </Group>

        <Group gap="sm" className="holdings-summary">
          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card"
          >
            <Text size="sm" c="dimmed">
              Total invested
            </Text>
            <Text fw={700} size="xl">
              {currencyFormatter.format(totalInvested)}
            </Text>
          </Paper>

          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card"
          >
            <Text size="sm" c="dimmed">
              Largest position
            </Text>
            <Text fw={700} size="xl">
              {topHolding?.ticker ?? "-"}
            </Text>
          </Paper>

          <Paper
            withBorder
            radius="lg"
            p="md"
            className="holdings-summary-card"
          >
            <Text size="sm" c="dimmed">
              Largest weight
            </Text>
            <Text fw={700} size="xl">
              {topHolding ? percentFormatter.format(topHolding.weights) : "-"}
            </Text>
          </Paper>
        </Group>

        <ScrollArea>
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="md"
            className="holdings-table"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ticker</Table.Th>
                <Table.Th>Sector</Table.Th>
                <Table.Th ta="right">Quantity</Table.Th>
                <Table.Th ta="right">Avg buy price</Table.Th>
                <Table.Th ta="right">Current price</Table.Th>
                <Table.Th ta="right">Amount invested</Table.Th>
                <Table.Th ta="right">Weight</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedRows.map((row) => (
                <Table.Tr key={row.ticker}>
                  <Table.Td>
                    <Text fw={700}>{row.ticker}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">{row.sector}</Text>
                  </Table.Td>
                  <Table.Td ta="right">{row.quantity}</Table.Td>
                  <Table.Td ta="right">
                    {currencyFormatter.format(row.avg_buy_price)}
                  </Table.Td>
                  <Table.Td ta="right">
                    {currencyFormatter.format(row["Current Price"])}
                  </Table.Td>
                  <Table.Td ta="right">
                    {currencyFormatter.format(row["Amount Invested"])}
                  </Table.Td>
                  <Table.Td ta="right">
                    {percentFormatter.format(row.weights)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </Paper>
  );
}

export default HoldingsBreakdownSection;

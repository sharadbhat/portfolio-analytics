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

type StocksBreakdownSectionProps = {
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

function StocksBreakdownSection({ rows }: StocksBreakdownSectionProps) {
  const sortedRows = [...rows].sort(
    (left, right) => right["amount_invested"] - left["amount_invested"],
  );
  const sectorCount = new Set(
    sortedRows.map((row) => row.sector).filter(Boolean),
  ).size;
  const totalInvested = sortedRows.reduce(
    (sum, row) => sum + row["amount_invested"],
    0,
  );
  const topHolding = sortedRows[0];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" gap="md">
        <Stack gap={4}>
          <Title order={2}>Stocks Breakdown</Title>
          <Text c="dimmed" maw={720}>
            Review how your capital is allocated across holdings so you can
            identify outsized positions and concentration risk more clearly.
          </Text>
        </Stack>

        <Badge variant="light" color="teal" size="lg" radius="xl">
          {sortedRows.length} holdings
        </Badge>
      </Group>

      <Group gap="sm" className="holdings-summary">
        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Total invested
          </Text>
          <Text fw={700} size="xl">
            {currencyFormatter.format(totalInvested)}
          </Text>
        </Paper>

        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Largest position
          </Text>
          <Text fw={700} size="xl">
            {topHolding?.ticker ?? "-"}
          </Text>
        </Paper>

        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Largest weight
          </Text>
          <Text fw={700} size="xl">
            {topHolding ? percentFormatter.format(topHolding.weights) : "-"}
          </Text>
        </Paper>

        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Total sectors covered
          </Text>
          <Text fw={700} size="xl">
            {sectorCount}
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
              <Table.Th ta="right">Average Buy Price</Table.Th>
              <Table.Th ta="right">Current Price</Table.Th>
              <Table.Th ta="right">Amount Invested</Table.Th>
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
                  {currencyFormatter.format(row["current_price"])}
                </Table.Td>
                <Table.Td ta="right">
                  {currencyFormatter.format(row["amount_invested"])}
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
  );
}

export default StocksBreakdownSection;

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
import SectorAllocationDonutChart from "./charts/SectorAllocationDonutChart";
import type { SectorAllocationRow } from "../types/portfolio";

type SectorBreakdownSectionProps = {
  rows: SectorAllocationRow[];
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

const sectorColors = [
  "teal.6",
  "cyan.6",
  "blue.6",
  "indigo.6",
  "grape.6",
  "lime.6",
  "orange.6",
  "pink.6",
];

function SectorBreakdownSection({ rows }: SectorBreakdownSectionProps) {
  const sortedRows = [...rows].sort(
    (left, right) => right.invested_per_sector - left.invested_per_sector,
  );
  const topSector = sortedRows[0];
  const totalInvested = sortedRows.reduce(
    (sum, row) => sum + row.invested_per_sector,
    0,
  );
  const totalHoldings = sortedRows.reduce(
    (sum, row) => sum + row.num_holdings,
    0,
  );
  const donutData = sortedRows.map((row, index) => ({
    name: row.sector,
    value: row.percent_in_sector,
    color: sectorColors[index % sectorColors.length],
  }));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" gap="md">
        <Stack gap={4}>
          <Title order={2}>Sector Breakdown</Title>
          <Text c="dimmed" maw={720}>
            See how your capital is distributed across sectors so you can spot
            concentration pockets and balance gaps more quickly.
          </Text>
        </Stack>

        <Badge variant="light" color="teal" size="lg" radius="xl">
          {sortedRows.length} sectors
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
            Largest sector
          </Text>
          <Text fw={700} size="xl">
            {topSector?.sector ?? "-"}
          </Text>
        </Paper>

        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Largest weight
          </Text>
          <Text fw={700} size="xl">
            {topSector
              ? percentFormatter.format(topSector.percent_in_sector / 100)
              : "-"}
          </Text>
        </Paper>

        <Paper withBorder radius="lg" p="md" className="holdings-summary-card">
          <Text size="sm" c="dimmed">
            Total holdings covered
          </Text>
          <Text fw={700} size="xl">
            {totalHoldings}
          </Text>
        </Paper>
      </Group>

      <Paper
        withBorder
        radius="lg"
        p="md"
        className="holdings-summary-card sector-donut-card"
      >
        <SectorAllocationDonutChart data={donutData} />
      </Paper>

      <ScrollArea>
        <Table
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="md"
          className="holdings-table"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Sector</Table.Th>
              <Table.Th ta="right">Holdings</Table.Th>
              <Table.Th ta="right">Amount Invested</Table.Th>
              <Table.Th ta="right">Portfolio Weight</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedRows.map((row) => (
              <Table.Tr key={row.sector}>
                <Table.Td>
                  <Text fw={700}>{row.sector}</Text>
                </Table.Td>
                <Table.Td ta="right">{row.num_holdings}</Table.Td>
                <Table.Td ta="right">
                  {currencyFormatter.format(row.invested_per_sector)}
                </Table.Td>
                <Table.Td ta="right">
                  {percentFormatter.format(row.percent_in_sector / 100)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}

export default SectorBreakdownSection;

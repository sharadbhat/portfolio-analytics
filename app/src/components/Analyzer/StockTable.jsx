import { Table } from "@mantine/core";

export function StockTable({ portfolioData }) {
  return (
    <Table
      stickyHeader
      stickyHeaderOffset={60}
      striped
      highlightOnHover
      withColumnBorders
      verticalSpacing={"sm"}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Ticker</Table.Th>
          <Table.Th>P/E Ratio</Table.Th>
          <Table.Th>Beta</Table.Th>
          <Table.Th>Equity</Table.Th>
          <Table.Th>Average Buy Price</Table.Th>
          <Table.Th>Price</Table.Th>
          <Table.Th>Percentage</Table.Th>
          <Table.Th>Weight</Table.Th>
          <Table.Th>Quantity</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {portfolioData &&
          Object.keys(portfolioData.stocks).map((ticker) => (
            <Table.Tr key={ticker}>
              <Table.Td>{ticker}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].pe_ratio}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].beta}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].equity}</Table.Td>
              <Table.Td>
                {portfolioData.stocks[ticker].average_buy_price}
              </Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].price}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].percentage}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].weight}</Table.Td>
              <Table.Td>{portfolioData.stocks[ticker].quantity}</Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
    </Table>
  );
}

import {
  Box,
  Container,
  LoadingOverlay,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { ScatterChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import axios from "axios";
import { StockTable } from "./StockTable";

export function Analyzer({ accessToken }) {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);

  const fetchPortfolio = async () => {
    if (!accessToken) return;
    const { data } = await axios.get("http://127.0.0.1:5000/analyze", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setPortfolioData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, [accessToken]);

  const scatterData = portfolioData
    ? [
        {
          name: "Stocks",
          data: Object.keys(portfolioData.stocks).map((ticker) => ({
            x: portfolioData.stocks[ticker].pe_ratio,
            y: portfolioData.stocks[ticker].beta,
            label: ticker,
          })),
        },
      ]
    : [];

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />
      <Container my="md">
        <Paper withBorder p="md" mb="md" shadow="sm" radius="md">
          <Stack gap="xs">
            <div>
              Portfolio Value: ${portfolioData ? portfolioData.equity : "0.00"}
            </div>
            <div>
              Portfolio Beta:{" "}
              {portfolioData ? portfolioData.portfolio_beta : "0.00%"}
            </div>
            <div>
              Annualized Return:{" "}
              {portfolioData ? portfolioData.portfolio_return : "0.00%"}
            </div>
            <div>
              Volatility:{" "}
              {portfolioData ? portfolioData.portfolio_volatility : "0.00%"}
            </div>
            <div>
              Sharpe Ratio:{" "}
              {portfolioData ? portfolioData.sharpe_ratio : "0.00"}
            </div>
          </Stack>
        </Paper>

        <StockTable portfolioData={portfolioData} />

        <Group>
          <ScatterChart
            h={350}
            w={600}
            xAxisLabel="P/E Ratio"
            yAxisLabel="Beta"
            data={scatterData}
            withTooltip
            dataKey={{ x: "x", y: "y" }}
            tooltipProps={{
              content: ({ payload }) => (
                <Paper p="xs" withBorder w={150}>
                  {payload && payload.length > 0 && (
                    <>
                      <Text fw={700} c={"dimmed"}>
                        {payload[0].payload.label}
                      </Text>
                      <Group justify="space-between">
                        <Text c="dimmed">P/E</Text>
                        <Text>{payload[0].payload.x}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text c="dimmed">Beta</Text>
                        <Text>{payload[0].payload.y}</Text>
                      </Group>
                    </>
                  )}
                </Paper>
              ),
            }}
          />
        </Group>
      </Container>
    </Box>
  );
}

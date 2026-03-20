import { Paper, SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import type {
  PortfolioAllocationRow,
  SectorAllocationRow,
} from "../types/portfolio";
import StocksBreakdownSection from "./StocksBreakdownSection";
import SectorBreakdownSection from "./SectorBreakdownSection";

type HoldingsOverviewSectionProps = {
  holdingsRows: PortfolioAllocationRow[];
  sectorRows: SectorAllocationRow[];
};

function HoldingsOverviewSection({
  holdingsRows,
  sectorRows,
}: HoldingsOverviewSectionProps) {
  const [breakdownView, setBreakdownView] = useState("stocks");

  return (
    <Stack gap="lg">
      <Paper radius="xl" shadow="xl" p="xl" className="results-panel">
        <Stack gap="xl">
          <SegmentedControl
            value={breakdownView}
            size="md"
            radius="xl"
            className="results-nav holdings-breakdown-nav"
            onChange={setBreakdownView}
            transitionDuration={500}
            data={[
              { label: "Stocks", value: "stocks" },
              { label: "Sectors", value: "sectors" },
            ]}
            withItemsBorders={false}
          />
          {breakdownView === "stocks" ? (
            <StocksBreakdownSection rows={holdingsRows} />
          ) : (
            <SectorBreakdownSection rows={sectorRows} />
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default HoldingsOverviewSection;

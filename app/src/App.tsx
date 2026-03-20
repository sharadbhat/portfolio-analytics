import { Anchor, Box, SegmentedControl, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import HoldingsOverviewSection from "./components/HoldingsOverviewSection";
import PerformanceOverviewSection from "./components/PerformanceOverviewSection";
import PortfolioUploadPanel from "./components/PortfolioUploadPanel";
import RiskOverviewSection from "./components/RiskOverviewSection";
import { sampleCsvs } from "./data/sampleCsvs";
import { usePortfolioUploadStore } from "./store/portfolioUploadStore";
import "./App.css";
import type { PortfolioAnalytics } from "./types/portfolio";

function App() {
  const analytics = usePortfolioUploadStore((state) => state.analytics);
  const resultsHeadingRef = useRef<HTMLParagraphElement | null>(null);
  const [segmentValue, setSegmentValue] = useState("holdings");

  useEffect(() => {
    if (!analytics || !resultsHeadingRef.current) {
      return;
    }

    resultsHeadingRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [analytics]);

  const renderSection = (analytics: PortfolioAnalytics) => {
    switch (segmentValue) {
      case "holdings":
        return (
          <HoldingsOverviewSection
            holdingsRows={analytics.holdings.portfolio_allocation}
            sectorRows={analytics.holdings.sector}
          />
        );
      case "performance":
        return (
          <PerformanceOverviewSection performance={analytics.performance} />
        );
      case "risk":
        return <RiskOverviewSection risk={analytics.risk} />;
    }
  };

  return (
    <Box className="app-shell">
      <Stack className="app-stack" gap="xl">
        <HeroSection />
        <PortfolioUploadPanel samples={sampleCsvs} />
        {analytics ? (
          <Stack gap="sm">
            <Text
              ref={resultsHeadingRef}
              fw={700}
              ta="center"
              size="xl"
              className="results-heading results-anchor"
            >
              Here&apos;s how your portfolio stacks up
            </Text>
            <SegmentedControl
              value={segmentValue}
              size="md"
              radius="xl"
              className="results-nav results-nav-primary"
              onChange={setSegmentValue}
              transitionDuration={500}
              fullWidth
              data={[
                { label: "Holdings", value: "holdings" },
                { label: "Performance", value: "performance" },
                { label: "Risk", value: "risk" },
              ]}
              withItemsBorders={false}
            />
            {renderSection(analytics)}
          </Stack>
        ) : null}
        <Text size="sm" c="dimmed" ta="right" className="page-attribution">
          <Anchor
            href="https://www.flaticon.com/free-icons/stocks"
            title="stocks icons"
            target="_blank"
            rel="noreferrer"
          >
            Stocks icons created by Boris farias - Flaticon
          </Anchor>
        </Text>
      </Stack>
    </Box>
  );
}

export default App;

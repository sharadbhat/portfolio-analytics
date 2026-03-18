import { Anchor, Box, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import HoldingsBreakdownSection from "./components/HoldingsBreakdownSection";
import PortfolioUploadPanel from "./components/PortfolioUploadPanel";
import { sampleCsvs } from "./data/sampleCsvs";
import { usePortfolioUploadStore } from "./store/portfolioUploadStore";
import "./App.css";

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
            <Group justify="center">
              <SegmentedControl
                value={segmentValue}
                size="md"
                radius="xl"
                className="results-nav"
                mx="auto"
                onChange={setSegmentValue}
                data={[
                  { label: "Holdings", value: "holdings" },
                  { label: "Performance", value: "performance" },
                  { label: "Risk", value: "risk" },
                ]}
              />
            </Group>
            {segmentValue === "holdings" ? (
              <HoldingsBreakdownSection
                rows={analytics.holdings.portfolio_allocation}
              />
            ) : null}
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

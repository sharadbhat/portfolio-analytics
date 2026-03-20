import { Loader, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import BlurText from "./TextAnimations/BlurText";

const ANALYZING_PHRASES = [
  "Analyzing your portfolio...",
  "Scoring your holdings...",
  "Measuring concentration and risk...",
  "Reviewing diversification signals...",
  "Calculating portfolio health...",
  "Finalizing your report...",
];

type AnalysisLoadingOverlayProps = {
  visible: boolean;
};

function AnalysisLoadingOverlay({ visible }: AnalysisLoadingOverlayProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setPhraseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPhraseIndex((currentIndex) =>
        Math.min(currentIndex + 1, ANALYZING_PHRASES.length - 1),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Stack align="center" gap="xs">
      <Loader color="teal" size="md" />
      <Text fw={600} size="lg" ta="center">
        <BlurText
          key={ANALYZING_PHRASES[phraseIndex]}
          text={ANALYZING_PHRASES[phraseIndex]}
        />
      </Text>
    </Stack>
  );
}

export default AnalysisLoadingOverlay;

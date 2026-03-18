import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Group,
  Image,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconMoonStars,
  IconSunHigh,
} from "@tabler/icons-react";
import logo from "../assets/logo.svg";

function HeroSection() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Group justify="space-between" align="flex-start" className="hero-header">
      <Box maw={760}>
        <Group gap="sm" align="center" mb="md" className="brand-lockup">
          <Image src={logo} alt="Portfolio Analytics logo" className="brand-logo" />
          <Badge radius="sm" variant="light" color="teal" size="lg">
            Portfolio Analytics
          </Badge>
        </Group>
        <Title order={1} className="app-title">
          Upload your holdings. We&apos;ll score the portfolio.
        </Title>
        <Text c="dimmed" size="lg" maw={620}>
          Drop in a CSV of your portfolio and we&apos;ll calculate
          concentration, diversification, sector exposure, and other metrics to
          help you understand how strong the portfolio really is.
        </Text>
      </Box>

      <Group gap="sm" className="hero-actions">
        <ActionIcon
          variant="light"
          color="teal"
          radius="xl"
          size={60}
          className="hero-icon"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setColorScheme(isDark ? "light" : "dark")}
        >
          {isDark ? <IconSunHigh size={24} /> : <IconMoonStars size={24} />}
        </ActionIcon>

        <Anchor
          href="https://github.com/bhatshaman/portfolio-analytics"
          target="_blank"
          rel="noreferrer"
          aria-label="Open the portfolio analytics GitHub repository"
        >
          <ActionIcon
            variant="light"
            color="teal"
            radius="xl"
            size={60}
            className="hero-icon"
          >
            <IconBrandGithub size={24} />
          </ActionIcon>
        </Anchor>
      </Group>
    </Group>
  );
}

export default HeroSection;

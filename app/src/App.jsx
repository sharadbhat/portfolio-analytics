import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { Analyzer } from "./components/Analyzer";

export function App() {
  const [opened, { toggle }] = useDisclosure();
  const [accessToken, setAccessToken] = useState(null);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          Portfolio Analyzer
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        {!accessToken ? (
          <LoginForm setAccessToken={setAccessToken} />
        ) : (
          <Analyzer accessToken={accessToken} />
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;

import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import classes from "./LoginForm.module.css";

export function LoginForm({ setAccessToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const login = async () => {
    setButtonLoading(true);
    const { data } = await axios.post("http://127.0.0.1:5000/login", {
      username: email,
      password,
    });
    setAccessToken(data.access_token);
    setButtonLoading(false);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Text className={classes.subtitle} mb={15}>
          Login with your Robinhood account
        </Text>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            required
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            mt="xl"
            radius="md"
            onClick={login}
            loading={buttonLoading}
          >
            {buttonLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

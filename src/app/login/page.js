"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken, removeToken] = useLocalStorage("token", null);

  const router = useRouter(); // ✅ initialize router

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(HttpUrlConfig.getLoginUrl(), {
        email,
        password,
      });
      const token = response.data.token;
      // Save token in localStorage
      setToken(token); // Update local state with the token
      setError(""); // Clear any previous error
      router.push("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

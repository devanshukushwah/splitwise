"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import { AppConstants } from "@/common/AppConstants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = ({ callback, timeout }) => {
    setTimeout(() => {
      setLoading(false);
      if (typeof callback === "function") {
        callback();
      }
    }, timeout || AppConstants.TIME_TO_STOP_BUTTON_LOADING); // Simulate a delay for loading state
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("Please enter both email and password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      startLoading();
      const response = await axios
        .post(HttpUrlConfig.getRegisterUrl(), {
          email,
          password,
        })
        .then((response) => {
          if (response.data.success) {
            stopLoading({ callback: () => (window.location.href = "/login") });
          } else {
            setError(response.data.error || "Registration failed.");
            stopLoading({ timeout: 0 }); // Stop loading state immediately
          }
        });
      setError(""); // Clear any previous error
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while logging in. Please try again.");
      }
      stopLoading({ timeout: 0 }); // Stop loading state immediately
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
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
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
            >
              Register
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?&nbsp;
              <a
                href="/login"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                Log in
              </a>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

// components/Header.js
"use client"; // needed if you're using App Router

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation"; // Use 'next/navigation' if using App Router
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Header() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          SPLITWISE
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {localStorage.getItem("token") ? (
            <>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleLogoutClick}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

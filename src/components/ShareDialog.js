import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

const ShareDialog = ({ open, onClose, onSubmit, item = null }) => {
  const [shares, setShares] = useState([]);
  const [email, setEmail] = useState("");

  // const handleSubmit = () => {
  //   onSubmit({ email });
  //   setEmails("");
  // };

  const handleClose = () => {
    onClose();
    setEmail("");
  };

  useEffect(() => {
    if (item) {
      setShares(item);
    }
  }, [item]);

  // Simple email validation regex
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [emailError, setEmailError] = useState("");

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (shares.some((share) => share.email === email)) {
      setEmailError("This email is already added.");
      return;
    }

    setEmailError("");
    onSubmit({ email });
    setEmail("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Share</DialogTitle>

      <DialogContent>
        <Stack
          direction="row"
          gap={1}
          alignItems={emailError ? "center" : "flex-end"}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            placeholder="Enter email"
            error={!!emailError}
            helperText={emailError}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Stack>
        <Typography>{shares.map((share) => share.email).join(", ")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;

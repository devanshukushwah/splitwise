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
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SpaceBar } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/lib/axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";

const ShareDialog = ({ open, onClose, entry_id }) => {
  const [shares, setShares] = useState([]);
  const [email, setEmail] = useState("");

  const handleClose = () => {
    onClose();
    setEmail("");
  };

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
    handleShareSubmit({ email });
    setEmail("");
  };

  const handleShareSubmit = (email) => {
    api
      .post(HttpUrlConfig.postSharesUrl(entry_id), email)
      .then((response) => {
        if (response?.data?.success) {
          fetchShares();
        }
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
      });
  };

  const fetchShares = async () => {
    api
      .get(HttpUrlConfig.getSharesUrl(entry_id))
      .then((response) => {
        setShares(response?.data?.data?.shares || []);
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
      });
  };

  const handleDelete = (share) => {
    api
      .delete(HttpUrlConfig.deleteSharesUrl(entry_id), {
        data: { email: share.email },
      })
      .then((response) => {
        if (response?.data?.success) {
          setShares(shares.filter((s) => s.email !== share.email));
        }
      })
      .catch((error) => {
        console.error("Error deleting share:", error);
      });
  };

  useEffect(() => {
    if (open) {
      fetchShares();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Share
        <Button
          onClick={handleClose}
          sx={{ minWidth: 0, padding: 0, color: "grey.600" }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

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
        <Stack direction="row" gap={1} mt={2} flexWrap="wrap">
          {shares.map((share) => (
            <Box key={share.email}>
              <Tooltip
                title={`Shared by ${share.created_by} on ${new Date(
                  share.created_at
                ).toLocaleDateString()}`}
                arrow
                enterDelay={500}
                leaveDelay={200}
              >
                <Chip
                  label={share.email}
                  variant="outlined"
                  onDelete={() => handleDelete(share)}
                />
              </Tooltip>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;

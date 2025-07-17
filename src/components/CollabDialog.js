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

const CollabDialog = ({ open, onClose, entry_id }) => {
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
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Collab
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 0, color: "grey.600" }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-end">
            <TextField
              autoFocus
              label="Email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="Enter email"
              error={!!emailError}
              helperText={emailError}
              size="small"
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ height: 40, minWidth: 100 }}
            >
              Add
            </Button>
          </Stack>
          <Divider />
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Collab with
          </Typography>
          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
            {shares.length === 0 ? (
              <Typography variant="body2" color="text.disabled">
                No collab yet.
              </Typography>
            ) : (
              shares.map((share) => (
                <Tooltip
                  key={share.email}
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
              ))
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CollabDialog;

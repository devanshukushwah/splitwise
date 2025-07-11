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
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const AddPersonDialog = ({ open, onClose }) => {
  const [name, setName] = useState("");

  const handleAddPerson = () => {
    onClose({ name });
    setName("");
  };

  const handleOnClose = () => {
    onClose(null);
    setName("");
  };

  return (
    <Dialog open={open} onClose={handleOnClose} maxWidth="xs" fullWidth>
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
          Add New Person
        </Typography>
        <Button
          onClick={handleOnClose}
          sx={{ minWidth: 0, color: "grey.600" }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Person Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
            InputProps={{
              sx: { bgcolor: "#fafafa" },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleOnClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAddPerson}
          variant="contained"
          color="primary"
          disabled={!name.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPersonDialog;

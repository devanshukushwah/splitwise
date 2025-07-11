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
} from "@mui/material";
import React, { useState } from "react";

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
      <DialogTitle sx={{ bgcolor: "#f5f5f5", fontWeight: 600 }}>
        Add New Person
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
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
      <DialogActions sx={{ bgcolor: "#f5f5f5" }}>
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

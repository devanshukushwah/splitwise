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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Person</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Person Name"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter person's name"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button onClick={handleAddPerson} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPersonDialog;

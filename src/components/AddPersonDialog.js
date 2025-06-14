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
  const [personName, setPersonName] = useState("");

  const handleAddPerson = () => {
    onClose({ personName });
    setPersonName("");
  };

  const handleOnClose = () => {
    onClose(null);
    setPersonName("");
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
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Cancel</Button>
        <Button onClick={handleAddPerson}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPersonDialog;

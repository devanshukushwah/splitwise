"use client";

import React, { useEffect, useState } from "react";
import AddPersonDialog from "../components/AddPersonDialog";
import { getCurrentUTCDateTimeLocal } from "../utils/DateUtils";
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
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import SpendResult from "@/components/SpendResult";
import GenerateSpendReport from "@/core/GenerateSpendReport";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  loadFromLocalStorageElseDefault,
  saveToLocalStorage,
} from "../utils/MyLocalStorage";
import { AppConstants } from "../common/AppConstants";

const SpendTrackerPage = () => {
  const [open, setOpen] = useState(false);
  const [openPersonDialog, setOpenPersonDialog] = useState(false);
  const [people, setPeople] = useState(
    loadFromLocalStorageElseDefault(AppConstants.PEOPLE, [])
  );
  const [spends, setSpends] = useState(
    loadFromLocalStorageElseDefault(AppConstants.SPENDS, [])
  );

  const [report, setReport] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    spender: "",
    time: "",
  });

  const handleOpen = () => {
    setForm({
      title: "",
      amount: "",
      spender: "",
      time: getCurrentUTCDateTimeLocal(),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ title: "", amount: "", spender: "", time: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSpend = () => {
    const newSpends = [...spends, form];
    setSpends(newSpends);
    saveToLocalStorage(AppConstants.SPENDS, newSpends);
    handleClose();
  };

  const handleOpenAddPerson = () => {
    setOpenPersonDialog(true);
  };

  const handleCloseAddPerson = (person) => {
    setOpenPersonDialog(false);
    if (person) {
      const newPeople = [...people, { ...person, id: people.length + 1 }];
      setPeople(newPeople);
      saveToLocalStorage(AppConstants.PEOPLE, newPeople);
    }
  };

  const handleReset = () => {
    setSpends([]);
    setPeople([]);
    saveToLocalStorage(AppConstants.SPENDS, []);
    saveToLocalStorage(AppConstants.PEOPLE, []);
  };

  useEffect(() => {
    const newReport = GenerateSpendReport(spends, people);
    setReport(newReport);
  }, [spends, people]);

  return (
    <Box p={4}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleOpenAddPerson}
          startIcon={<PersonIcon />}
        >
          Add Person
        </Button>
        <Button
          variant="contained"
          onClick={handleOpen}
          disabled={people.length === 0}
          startIcon={<AddIcon />}
        >
          Add Spend
        </Button>
        <Button
          variant="contained"
          onClick={handleReset}
          startIcon={<RestartAltIcon />}
        >
          Reset
        </Button>
      </Stack>
      <AddPersonDialog open={openPersonDialog} onClose={handleCloseAddPerson} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Spend</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            variant="standard"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Spend Amount"
            name="amount"
            type="number"
            fullWidth
            variant="standard"
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Spend By"
            name="spender"
            fullWidth
            select
            variant="standard"
            value={form.spender}
            onChange={handleChange}
          >
            {people.map((person, idx) => (
              <MenuItem key={idx} value={person}>
                {person.personName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Time"
            name="time"
            type="datetime-local"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={form.time}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddSpend}>Add</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Spend Amount</TableCell>
              <TableCell>Spend By</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spends.map((spend, index) => (
              <TableRow key={index}>
                <TableCell>{spend.title}</TableCell>
                <TableCell>₹ {spend.amount}</TableCell>
                <TableCell>{spend.spender.personName}</TableCell>
                <TableCell>{new Date(spend.time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {spends.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No spend data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ margin: 2 }} />
      <SpendResult data={report} />
    </Box>
  );
};

function home() {
  return (
    <>
      <SpendTrackerPage />
    </>
  );
}

export default home;

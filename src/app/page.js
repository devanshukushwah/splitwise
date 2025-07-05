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
  IconButton,
} from "@mui/material";
import SpendResult from "@/components/SpendResult";
import GenerateSpendReport from "@/core/GenerateSpendReport";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  loadFromLocalStorageElseDefault,
  saveToLocalStorage,
} from "../utils/MyLocalStorage";
import { AppConstants } from "../common/AppConstants";
import SpendDialog from "@/components/SpendDialog";
import Header from "@/components/Header";

const SpendTrackerPage = () => {
  const [open, setOpen] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [openPersonDialog, setOpenPersonDialog] = useState(false);
  const [people, setPeople] = useState(
    loadFromLocalStorageElseDefault(AppConstants.PEOPLE, [])
  );
  const [peopleMap, setPeopleMap] = useState({});
  const [spends, setSpends] = useState(
    loadFromLocalStorageElseDefault(AppConstants.SPENDS, [])
  );
  const [editSpend, setEditSpend] = useState(null);

  useEffect(() => {
    let peopleMap = {};
    for (let obj of people) {
      peopleMap[obj.person_id] = obj.personName;
    }
    setPeopleMap(peopleMap);
  }, [people]);

  const [report, setReport] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (spend_id) => {
    // console.log(spend_id);
    const spend = spends.find((item) => item.spend_id === spend_id);
    setEditSpend({ ...spend });
    console.log(spend);

    setEditDialog(true);
  };

  const handleEditClose = () => {
    setEditDialog(false);
  };

  const handleAddSpend = (form) => {
    const newSpends = [...spends, { ...form, spend_id: spends.length + 1 }];
    setSpends(newSpends);
    saveToLocalStorage(AppConstants.SPENDS, newSpends);
    handleClose();
  };

  const handleEditSpend = (form) => {
    const updatedSpends = spends.map((spend) =>
      spend.spend_id === form.spend_id ? { ...form } : spend
    );
    setSpends(updatedSpends);
    saveToLocalStorage(AppConstants.SPENDS, updatedSpends);
    setEditDialog(false);
    setEditSpend(null);
  };

  const handleOpenAddPerson = () => {
    setOpenPersonDialog(true);
  };

  const handleCloseAddPerson = (person) => {
    setOpenPersonDialog(false);
    if (person) {
      const newPeople = [
        ...people,
        { ...person, person_id: people.length + 1 },
      ];
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

  const getPersonNames = (spendFor) => {
    return spendFor.map((id) => peopleMap[id] || "Unknown").join(", ");
  };

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
          color="secondary"
        >
          Add Spend
        </Button>
        <Button
          variant="contained"
          onClick={handleReset}
          startIcon={<RestartAltIcon />}
          color="error"
        >
          Reset
        </Button>
      </Stack>
      <AddPersonDialog open={openPersonDialog} onClose={handleCloseAddPerson} />
      <SpendDialog
        open={open}
        people={people}
        onClose={handleClose}
        onSubmit={handleAddSpend}
      />
      <SpendDialog
        open={editDialog}
        people={people}
        onClose={handleEditClose}
        onSubmit={handleEditSpend}
        item={editSpend}
      />

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Spend Amount</TableCell>
              <TableCell>Spend By</TableCell>
              <TableCell>Spend For</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spends.map((spend, index) => (
              <TableRow key={index}>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditOpen(spend.spend_id)}
                  >
                    <EditIcon />
                  </IconButton>
                  {spend.title}
                </TableCell>
                <TableCell>₹ {spend.amount}</TableCell>
                <TableCell>{peopleMap[spend.spender]}</TableCell>
                <TableCell>{getPersonNames(spend.spend_for)}</TableCell>
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
      <SpendResult data={report} people={people} />
    </Box>
  );
};

function home() {
  return (
    <>
      <Header />
      <SpendTrackerPage />
    </>
  );
}

export default home;

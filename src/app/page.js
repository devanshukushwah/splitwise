"use client";

import React, { useEffect, useState } from "react";
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
import SpendTable from "@/components/SpendTable";
import PeopleDialog from "@/components/PeopleDialog";
import { deletePeople, getPeople, postPeople } from "@/apiLocalStorage/people";
import { getSpends, putSpend } from "@/apiLocalStorage/spend";

const SpendTrackerPage = ({ entry_id }) => {
  const [open, setOpen] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [openPersonDialog, setOpenPersonDialog] = useState(false);
  const [people, setPeople] = useState([]);
  const [peopleMap, setPeopleMap] = useState({});
  const [spends, setSpends] = useState([]);
  const [editSpend, setEditSpend] = useState(null);

  useEffect(() => {
    let peopleMap = {};
    for (let obj of people) {
      peopleMap[obj._id] = obj.name;
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
    const spend = spends.find((item) => item._id === spend_id);
    setEditSpend({ ...spend });
    setEditDialog(true);
  };

  const handleEditClose = () => {
    setEditDialog(false);
  };

  const handleAddSpend = (form) => {
    const newSpends = [...spends, { ...form, _id: spends.length + 1 }];
    setSpends(newSpends);
    saveToLocalStorage(AppConstants.SPENDS_OFFLINE, newSpends);
    handleClose();
  };

  const handleOpenAddPerson = () => {
    setOpenPersonDialog(true);
  };

  const handleCloseAddPerson = (people) => {
    setOpenPersonDialog(false);
    setPeople(people);
  };

  const handleReset = () => {
    setSpends([]);
    setPeople([]);
    saveToLocalStorage(AppConstants.SPENDS_OFFLINE, []);
    saveToLocalStorage(AppConstants.PEOPLE_OFFLINE, []);
  };

  useEffect(() => {
    const newReport = GenerateSpendReport(spends, people);
    setReport(newReport);
  }, [spends, people]);

  const fetchSpends = async () => {
    try {
      const response = await getSpends({ entry_id });
      const spends = response?.data?.spends || [];
      setSpends(spends);
    } catch (error) {
      console.error("Error fetching spends:", error);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await getPeople({ entry_id });
      const people = response?.data?.people || [];
      setPeople(people);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  useEffect(() => {
    fetchSpends();
    fetchPeople();
  }, []);

  const handleEditSpend = async (spend) => {
    try {
      const response = await putSpend({ entry_id, spend });
      if (response.success) {
        const updatedSpends = spends.map((item) =>
          item._id === spend._id ? { ...spend } : item
        );
        setSpends(updatedSpends);
      }
      setEditDialog(false);
      setEditSpend(null);
    } catch (error) {
      console.error("Error editing spends:", error);
    }
  };

  return (
    <>
      <PeopleDialog
        open={openPersonDialog}
        onClose={handleCloseAddPerson}
        entry_id={AppConstants.OFFLINE}
        apiDeletePeople={deletePeople}
        apiGetPeople={getPeople}
        apiPostPeople={postPeople}
      />
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
        <SpendTable spends={spends} people={people} onEdit={handleEditOpen} />
        <Divider sx={{ margin: 2 }} />
        <SpendResult data={report} people={people} />
      </Box>
    </>
  );
};

function home() {
  return (
    <>
      <Header />
      <SpendTrackerPage entry_id={AppConstants.OFFLINE} />
    </>
  );
}

export default home;

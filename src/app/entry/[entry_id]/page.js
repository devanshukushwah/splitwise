"use client";

import Header from "@/components/Header";
import { use } from "react";
import React, { useEffect, useState } from "react";
import AddPersonDialog from "@/components/AddPersonDialog";
import { getCurrentUTCDateTimeLocal } from "@/utils/DateUtils";
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
import { AppConstants } from "@/common/AppConstants";
import SpendDialog from "@/components/SpendDialog";
import api from "@/lib/axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import ShareIcon from "@mui/icons-material/Share";
import ShareDialog from "@/components/ShareDialog";

const SpendTrackerPage = ({ entry_id }) => {
  const [open, setOpen] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
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

  const handleAddSpend = (spend) => {
    api.post(HttpUrlConfig.postSpendUrl(entry_id), spend).then((response) => {
      handleClose();
      const newSpends = [
        ...spends,
        { ...spend, _id: response.data.data.spend_id },
      ];
      setSpends(newSpends);
    });
  };

  const handleEditSpend = (spend) => {
    api
      .put(HttpUrlConfig.putSpendsUrl(entry_id, spend._id), spend)
      .then((response) => {
        console.log("Spend updated successfully:", response.data);
        const updatedSpends = spends.map((item) =>
          item._id === spend._id ? { ...spend } : item
        );
        setSpends(updatedSpends);
        setEditDialog(false);
        setEditSpend(null);
      })
      .catch((error) => {
        console.error("Error updating spend:", error);
      });
  };

  const handleOpenAddPerson = () => {
    setOpenPersonDialog(true);
  };

  const handleCloseAddPerson = async (person) => {
    setOpenPersonDialog(false);
    if (person) {
      api
        .post(HttpUrlConfig.postPeopleUrl(entry_id), person)
        .then((response) => {
          const newPerson = {
            _id: response?.data?.data?.person_id,
            name: person.name,
          };

          setPeople([...people, newPerson]);
        })
        .catch((error) => {
          console.error("Error fetching people:", error);
        });
    }
  };

  useEffect(() => {
    const newReport = GenerateSpendReport(spends, people);
    setReport(newReport);
  }, [spends, people]);

  const getPersonNames = (spendFor) => {
    return spendFor?.map((id) => peopleMap[id] || "Unknown").join(", ");
  };

  const fetchSpends = async () => {
    api
      .get(HttpUrlConfig.getSpendsUrl(entry_id))
      .then((response) => {
        setSpends(response?.data?.data?.spends || []);
      })
      .catch((error) => {
        console.error("Error fetching spends:", error);
      });
  };

  const fetchPeople = async () => {
    api
      .get(HttpUrlConfig.getPeopleUrl(entry_id))
      .then((response) => {
        setPeople(response?.data?.data?.people || []);
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
      });
  };

  useEffect(() => {
    fetchSpends();
    fetchPeople();
  }, []);

  const handleShareClose = () => {
    setShareDialog(false);
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
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={() => setShareDialog(true)}
        >
          Share
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
      <ShareDialog
        open={shareDialog}
        onClose={handleShareClose}
        entry_id={entry_id}
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
                    onClick={() => handleEditOpen(spend._id)}
                  >
                    <EditIcon />
                  </IconButton>
                  {spend.title}
                </TableCell>
                <TableCell>₹ {spend.amount}</TableCell>
                <TableCell>{peopleMap[spend.spend_by] || "None"}</TableCell>
                <TableCell>
                  {getPersonNames(spend.spend_for) || "None"}
                </TableCell>
                <TableCell>
                  {new Date(spend.created_at).toLocaleString(undefined, {
                    year: "2-digit",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
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

function Page({ params }) {
  const { entry_id } = use(params);

  return (
    <>
      <Header />
      <SpendTrackerPage entry_id={entry_id} />
    </>
  );
}

export default Page;

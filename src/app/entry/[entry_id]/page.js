"use client";

import Header from "@/components/Header";
import { use } from "react";
import React, { useEffect, useState } from "react";
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
  Container,
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
import SpendTable from "@/components/SpendTable";
import { People } from "@mui/icons-material";
import PeopleDialog from "@/components/PeopleDialog";

import { deletePeople, getPeople, postPeople } from "@/api/people";
import { getSpends, postSpend, putSpend } from "@/api/spend";
import Breadcrumb from "@/components/Breadcrumb";

const SpendTrackerPage = ({ entry_id }) => {
  const [open, setOpen] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [openPersonDialog, setOpenPersonDialog] = useState(false);
  const [people, setPeople] = useState([]);
  const [peopleMap, setPeopleMap] = useState({});
  const [spends, setSpends] = useState([]);
  const [editSpend, setEditSpend] = useState(null);
  const [spendLoading, setSpendLoading] = useState(false);

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

  const startSpendLoading = () => {
    setSpendLoading(true);
  };

  const stopSpendLoading = ({ callback = () => {}, timeout = null } = {}) => {
    setTimeout(() => {
      setSpendLoading(false);
      if (typeof callback === "function") {
        callback();
      }
    }, timeout || AppConstants.TIME_TO_STOP_BUTTON_LOADING); // Simulate a delay for loading state
  };

  const handleAddSpend = async (spend) => {
    startSpendLoading();
    try {
      const response = await postSpend({ entry_id, spend });
      if (response.success) {
        const newSpends = [
          ...spends,
          { ...spend, _id: response.data.spend_id },
        ];
        setSpends(newSpends);
      }
      stopSpendLoading({ callback: () => handleClose() });
    } catch (error) {
      console.error("Error adding spends:", error);
      stopSpendLoading();
    }
  };

  const handleEditSpend = async (spend) => {
    startSpendLoading();
    try {
      const response = await putSpend({ entry_id, spend });
      if (response.success) {
        const updatedSpends = spends.map((item) =>
          item._id === spend._id ? { ...spend } : item
        );
        setSpends(updatedSpends);
      }
      stopSpendLoading({
        callback: () => {
          setEditDialog(false);
          setEditSpend(null);
        },
      });
    } catch (error) {
      console.error("Error editing spends:", error);
      stopSpendLoading();
    }
  };

  const handleOpenAddPerson = () => {
    setOpenPersonDialog(true);
  };

  const handleCloseAddPerson = async () => {
    setOpenPersonDialog(false);
  };

  useEffect(() => {
    const newReport = GenerateSpendReport(spends, people);
    setReport(newReport);
  }, [spends, people]);

  const getPersonNames = (spendFor) => {
    return spendFor?.map((id) => peopleMap[id] || "Unknown").join(", ");
  };

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
  }, [openPersonDialog]);

  const handleShareClose = () => {
    setShareDialog(false);
  };

  return (
    <>
      <PeopleDialog
        open={openPersonDialog}
        onClose={handleCloseAddPerson}
        entry_id={entry_id}
        apiDeletePeople={deletePeople}
        apiGetPeople={getPeople}
        apiPostPeople={postPeople}
      />
      <SpendDialog
        open={open}
        people={people}
        onClose={handleClose}
        onSubmit={handleAddSpend}
        loading={spendLoading}
      />
      <SpendDialog
        open={editDialog}
        people={people}
        onClose={handleEditClose}
        onSubmit={handleEditSpend}
        item={editSpend}
        loading={spendLoading}
      />
      <ShareDialog
        open={shareDialog}
        onClose={handleShareClose}
        entry_id={entry_id}
      />

      <Box>
        <Stack direction="row" spacing={2} mb={3}>
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
        <SpendTable spends={spends} people={people} onEdit={handleEditOpen} />
        <Divider sx={{ margin: 2 }} />
        <SpendResult data={report} people={people} />
      </Box>
    </>
  );
};

function Page({ params }) {
  const { entry_id } = use(params);

  const breadCrumbList = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: entry_id,
      href: `/entry/${entry_id}`,
      isText: true,
    },
  ];

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Box mb={2}>
          <Breadcrumb links={breadCrumbList} />
        </Box>
        <SpendTrackerPage entry_id={entry_id} />
      </Container>
    </>
  );
}

export default Page;

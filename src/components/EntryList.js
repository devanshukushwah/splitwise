"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import Loader from "./Loader";
import { AppConstants } from "@/common/AppConstants";

export default function EntryList() {
  const [open, setOpen] = useState(false);
  const [entryName, setEntryName] = useState("");
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [addEntryLoading, setAddEntryLoading] = useState(false);

  const stopEntriesLoading = () => {
    setEntriesLoading(false);
  };

  const startEntriesLoading = () => {
    setEntriesLoading(true);
  };

  const startAddEntryLoading = () => {
    setAddEntryLoading(true);
  };

  const stopAddEntryLoading = () => {
    setTimeout(() => {
      setAddEntryLoading(false);
      handleClose();
    }, AppConstants.TIME_TO_STOP_BUTTON_LOADING);
  };

  const handleAddEntry = () => {
    if (entryName.trim() === "") return;
    startAddEntryLoading();
    const entry = { title: entryName.trim() };
    api
      .post(HttpUrlConfig.postEntryUrl(), entry)
      .then((response) => {
        setEntries([{ ...entry, _id: response?.data?.entry_id }, ...entries]);
        stopAddEntryLoading();
      })
      .catch((error) => {
        console.error("Error adding entry:", error);
        stopAddEntryLoading();
      });
  };

  const fetchEntries = async () => {
    startEntriesLoading();
    try {
      const response = await api.get(HttpUrlConfig.getEntriesUrl());
      setEntries(response.data.entries);
      stopEntriesLoading();
    } catch (error) {
      console.error("Error fetching entries:", error);
      stopEntriesLoading();
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEntryName("");
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Entries</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Entry
          </Button>
        </Box>

        {entriesLoading ? <Loader /> : <Entries entries={entries} />}

        {/* Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Entry Name"
              fullWidth
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleAddEntry}
              variant="contained"
              color="primary"
              loading={addEntryLoading}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

const Entries = ({ entries }) => {
  const router = useRouter();

  const handleGoClick = (entryId) => {
    if (!entryId) return;
    router.push(`/entry/${entryId}`);
  };
  return (
    <Stack spacing={2}>
      {entries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No entries yet.
        </Typography>
      ) : (
        entries.map((entry, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="body1">{entry.title}</Typography>
                  {entry.created_at && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(entry.created_at).toLocaleTimeString([], {
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EastIcon />}
                  onClick={() => handleGoClick(entry._id)}
                >
                  Go
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};

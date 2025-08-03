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
  Stack,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SpaceBar } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/lib/axios";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import { AppConstants } from "@/common/AppConstants";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { ApiContextType } from "@/common/ApiContextType";
import DialogTemplate from "./DialogTemplate";
import { displayPersonName } from "@/utils/PersonUtils";
import { isValidEmail } from "@/utils/AppUtils";

const defaultValue = () => ({
  email: "",
});

const PeopleDialog = ({
  open,
  onClose,
  entry_id,
  apiGetPeople,
  apiPostPeople,
  apiDeletePeople,
}) => {
  const { people } = useApiState();
  const dispatch = useApiDispatch();
  const [person, setPerson] = useState(defaultValue);
  const [error, setError] = useState("");
  const [addPersonLoading, setAddPersonLoading] = useState(false);

  const startAddPersonLoading = () => {
    setAddPersonLoading(true);
  };

  const stopAddPersonLoading = ({
    callback = () => {},
    timeout = null,
  } = {}) => {
    setTimeout(() => {
      setAddPersonLoading(false);
      if (typeof callback === "function") {
        callback();
      }
    }, timeout || AppConstants.TIME_TO_STOP_BUTTON_LOADING);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!isValidEmail(person.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const findPeople = people.find((item) => item.email === person.email);

    if (findPeople?.isDeleted === true) {
      setError("This person was added earlier");
      return;
    }

    if (findPeople) {
      setError("This person is already added");
      return;
    }

    setError("");
    handlePersonSubmit(person);
    setPerson(defaultValue());
  };

  const handlePersonSubmit = async (person) => {
    startAddPersonLoading();
    try {
      const response = await apiPostPeople({ entry_id, person });
      if (response?.success) {
        stopAddPersonLoading({
          callback: () => {
            const newPerson = response?.data?.person;
            if (newPerson) {
              dispatch({
                type: ApiContextType.UPDATE_PEOPLE,
                value: [...people, newPerson],
              });
            }
          },
        });
      } else {
        stopAddPersonLoading();
      }
    } catch (error) {
      console.error("Error submitting person:", error);
      stopAddPersonLoading();
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await apiGetPeople({ entry_id });
      const people = response?.data?.people || [];
      dispatch({ type: ApiContextType.UPDATE_PEOPLE, value: people });
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const handleDelete = async (person) => {
    try {
      const response = await apiDeletePeople({ entry_id, person });
      if (response?.success) {
        const updatedPeople = people.map((item) => {
          if (item._id === person._id) {
            return { ...item, isDeleted: true };
          }
          return item;
        });
        dispatch({ type: ApiContextType.UPDATE_PEOPLE, value: updatedPeople });
      }
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPeople();
    }
  }, [open]);

  return (
    <DialogTemplate
      isOpen={open}
      onClose={handleClose}
      title="Person"
      disableActions
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            autoFocus
            label="Email"
            fullWidth
            variant="outlined"
            value={person.email}
            onChange={(e) => {
              setPerson({ email: e.target.value });
              if (error) setError("");
            }}
            placeholder="Enter person email"
            error={!!error}
            helperText={error}
            size="small"
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: 40, minWidth: 100 }}
            loading={addPersonLoading}
          >
            Add
          </Button>
        </Stack>
        <Divider />
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          People List
        </Typography>
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
          {people?.filter((item) => item?.isDeleted !== true).length === 0 ? (
            <Typography variant="body2" color="text.disabled">
              No people yet.
            </Typography>
          ) : (
            people
              ?.filter((item) => item?.isDeleted !== true)
              ?.map((person) => (
                <Tooltip
                  key={person._id}
                  title={`Added by ${person.created_by} on ${new Date(
                    person.created_at
                  ).toLocaleDateString()}`}
                  arrow
                  enterDelay={500}
                  leaveDelay={200}
                >
                  <Chip
                    label={`${displayPersonName(person)}`}
                    variant="outlined"
                    onDelete={() => handleDelete(person)}
                  />
                </Tooltip>
              ))
          )}
        </Stack>
      </Stack>
    </DialogTemplate>
  );
};

export default PeopleDialog;

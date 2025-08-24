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
import { postGuest } from "@/api/user";
import LazyInvoke from "@/utils/LazyInvoke";

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
  const { people, peopleNameMap, loading } = useApiState();
  const dispatch = useApiDispatch();
  const [person, setPerson] = useState(defaultValue);
  const [error, setError] = useState("");
  const [guestRequired, setGuestRequired] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValidEmail(person.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const findPeople = people.find(
      (item) => item?.user?.email === person.email
    );

    if (findPeople?.isDeleted === true) {
      setError("This person was added earlier");
      return;
    }

    if (findPeople) {
      setError("This person is already added");
      return;
    }

    setError("");
    dispatch({ type: ApiContextType.START_ADD_PEOPLE_LOADING });
    try {
      const response = await apiPostPeople({ entry_id, person });
      if (response?.success) {
        LazyInvoke({
          callback: () => {
            const newPerson = response?.data?.person;
            if (newPerson) {
              dispatch({
                type: ApiContextType.UPDATE_PEOPLE,
                value: [...people, newPerson],
              });
            }
            dispatch({ type: ApiContextType.STOP_ADD_PEOPLE_LOADING });
          },
        });
      } else {
        if (response?.guestRequired) {
          setGuestRequired(true);
          setError("User not found. Please register as a guest first.");
        } else {
          setError(response?.error || "Failed to add person.");
          setPerson(defaultValue());
        }
        dispatch({ type: ApiContextType.STOP_ADD_PEOPLE_LOADING });
      }
    } catch (error) {
      console.error("Error submitting person:", error);
      dispatch({ type: ApiContextType.STOP_ADD_PEOPLE_LOADING });
    }
  };

  const createGuestUserObject = (person) => {
    const firstName = person?.email?.split("@")[0]?.slice(0, 6);
    return {
      email: person.email,
      firstName,
      entryId: entry_id,
    };
  };

  const handleGuestSubmit = async () => {
    try {
      dispatch({ type: ApiContextType.START_ADD_GUEST_LOADING });
      const user = createGuestUserObject(person);
      const response = await postGuest({
        user,
      });
      if (response?.success) {
        setGuestRequired(false);
        setPerson(defaultValue());
        setError("");
        fetchPeople();
      } else {
        setError(response?.error || "Failed to register guest.");
      }
      LazyInvoke({
        callback: () => {
          dispatch({ type: ApiContextType.STOP_ADD_GUEST_LOADING });
        },
      });
    } catch (error) {
      console.error("Error registering guest:", error);
      setError("Failed to register guest.");
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
              if (guestRequired) setGuestRequired(false);
            }}
            placeholder="Enter person email"
            error={!!error}
            helperText={error}
            size="small"
          />

          {guestRequired ? (
            <Button
              onClick={handleGuestSubmit}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ height: 40, minWidth: 100 }}
              loading={loading.addGuest}
            >
              Guest
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ height: 40, minWidth: 100 }}
              loading={loading.addPeople}
            >
              Add
            </Button>
          )}
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
                  title={`Added by ${
                    peopleNameMap[person.created_by]
                  } on ${new Date(person.created_at).toLocaleDateString()}`}
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

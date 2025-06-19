import { getCurrentUTCDateTimeLocal } from "@/utils/DateUtils";
import { DisabledByDefault } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";

const defaultValue = () => ({
  title: "",
  amount: "",
  spender: "",
  spend_for: [],
  time: getCurrentUTCDateTimeLocal(),
});

function SpendDialog({ open, people, onClose, onSubmit, item = null }) {
  const [spend, setSpend] = React.useState(null);

  const handleChange = (e) => {
    setSpend({ ...spend, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const spendData = { ...spend };
    if (item?.spend_id) {
      spendData.spend_id = item.spend_id;
    }
    onSubmit(spendData);
    setSpend(defaultValue());
  };

  const handleOnClose = () => {
    onClose();
    setSpend(defaultValue());
  };

  useEffect(() => {
    if (item) {
      setSpend({
        ...item,
        time: getCurrentUTCDateTimeLocal(),
      });
    } else {
      setSpend(defaultValue());
    }
  }, [item]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{item ? "Edit" : "Add"} Spend</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            variant="standard"
            value={spend?.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Spend Amount"
            name="amount"
            type="number"
            fullWidth
            variant="standard"
            value={spend?.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Spend By"
            name="spender"
            fullWidth
            select
            variant="standard"
            value={spend?.spender}
            onChange={handleChange}
          >
            {people.map((person, idx) => (
              <MenuItem key={idx} value={person.person_id}>
                {person.personName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Spend For"
            name="spend_for"
            fullWidth
            select
            SelectProps={{
              multiple: true,
              renderValue: (selected) =>
                people
                  .filter((p) => selected.includes(p.person_id))
                  .map((p) => p.personName)
                  .join(", "),
            }}
            variant="standard"
            value={spend?.spend_for || []}
            onChange={(e) => {
              const value = Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value];
              setSpend({ ...spend, spend_for: value });
            }}
          >
            {people.map((person, idx) => (
              <MenuItem key={idx} value={person.person_id}>
                {/* <input
                  type="checkbox"
                  checked={
                    spend?.spend_for?.includes(person.person_id) || false
                  }
                  style={{ marginRight: 8 }}
                  readOnly
                />
                {person.personName} */}
                <Checkbox
                  checked={
                    spend?.spend_for?.includes(person.person_id) || false
                  }
                />
                <ListItemText primary={person.personName} />
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
            value={spend?.time}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {item ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SpendDialog;

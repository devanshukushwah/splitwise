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
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";

const defaultValue = () => ({
  title: "",
  amount: "",
  spend_by: "",
  spend_for: [],
  created_at: getCurrentUTCDateTimeLocal(),
});

function SpendDialog({
  open,
  people,
  onClose,
  onSubmit,
  loading,
  item = null,
}) {
  const [spend, setSpend] = React.useState(null);

  const handleChange = (e) => {
    setSpend({ ...spend, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const spendData = { ...spend };
    if (item?._id) {
      spendData._id = item._id;
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
        created_at: getCurrentUTCDateTimeLocal(),
      });
    } else {
      setSpend(defaultValue());
    }
  }, [item]);

  // Method to select all people for spend_for
  const handleSelectAll = () => {
    const allIds = people.map((person) => person._id);
    setSpend({ ...spend, spend_for: allIds });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: "#f5f5f5", fontWeight: 600 }}>
        {item ? "Edit Spend" : "Add Spend"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            variant="outlined"
            value={spend?.title}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            variant="outlined"
            value={spend?.amount}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Spend By"
            name="spend_by"
            fullWidth
            select
            variant="outlined"
            value={spend?.spend_by}
            onChange={handleChange}
          >
            {people.map((person) => (
              <MenuItem key={person._id} value={person._id}>
                <ListItemText primary={person.name} />
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Spend For"
              name="spend_for"
              fullWidth
              select
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  people
                    .filter((p) => selected.includes(p._id))
                    .map((p) => p.name)
                    .join(", "),
              }}
              variant="outlined"
              value={spend?.spend_for || []}
              onChange={(e) => {
                const value = Array.isArray(e.target.value)
                  ? e.target.value
                  : [e.target.value];
                setSpend({ ...spend, spend_for: value });
              }}
            >
              {people.map((person) => (
                <MenuItem key={person._id} value={person._id}>
                  <Checkbox
                    checked={spend?.spend_for?.includes(person._id) || false}
                  />
                  <ListItemText primary={person.name} />
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" onClick={handleSelectAll}>
              All
            </Button>
          </Stack>
          <TextField
            label="Time"
            name="created_at"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={spend?.created_at}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#f5f5f5" }}>
        <Button onClick={handleOnClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          loading={loading}
          disabled={!spend?.title}
        >
          {item ? "Save Changes" : "Add Spend"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SpendDialog;

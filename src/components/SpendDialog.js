import { getCurrentUTCDateTimeLocal } from "@/utils/DateUtils";
import { DisabledByDefault } from "@mui/icons-material";
import {
  Box,
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
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { displayPersonName } from "@/utils/PersonUtils";

const defaultValue = () => ({
  title: "",
  amount: "",
  spend_by: "",
  spend_for: [],
  // created_at: getCurrentUTCDateTimeLocal(),
});

function SpendDialog({
  open,
  people,
  onClose,
  onSubmit,
  loading,
  item = null,
}) {
  const [spend, setSpend] = React.useState(defaultValue());

  const handleChange = (e) => {
    setSpend({ ...spend, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const spendData = { ...spend };
    if (item?._id) {
      spendData._id = item._id;
    }
    onSubmit(spendData);
  };

  useEffect(() => {
    if (item) {
      setSpend({
        ...item,
      });
    } else {
      setSpend(defaultValue());
    }
  }, [item]);

  // Method to select all people for spend_for
  const handleSelectAll = () => {
    const allUserIds = people
      .filter((item) => item?.isDeleted !== true)
      .map((person) => person.userId);
    setSpend({ ...spend, spend_for: allUserIds });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {item ? "Edit Spend" : "Add Spend"}
        </Typography>
        <Button
          onClick={onClose}
          sx={{ minWidth: 0, color: "grey.600" }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
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
            size="small"
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
            size="small"
          />
          <TextField
            label="Paid By"
            name="spend_by"
            fullWidth
            select
            variant="outlined"
            value={spend?.spend_by}
            onChange={handleChange}
            size="small"
          >
            {people
              ?.filter((item) => item?.isDeleted !== true)
              ?.map((person) => (
                <MenuItem key={person.userId} value={person.userId}>
                  <ListItemText primary={displayPersonName(person)} />
                </MenuItem>
              ))}
          </TextField>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Paid For"
              name="spend_for"
              fullWidth
              select
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  people
                    .filter((p) => selected.includes(p.userId))
                    .map((p) => displayPersonName(p))
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
              {people
                ?.filter((item) => item?.isDeleted !== true)
                ?.map((person) => (
                  <MenuItem key={person.userId} value={person.userId}>
                    <Checkbox
                      checked={
                        spend?.spend_for?.includes(person.userId) || false
                      }
                    />
                    <ListItemText primary={displayPersonName(person)} />
                  </MenuItem>
                ))}
              {people
                ?.filter(
                  (item) =>
                    item?.isDeleted === true &&
                    spend?.spend_for?.includes(item.userId)
                )
                ?.map((person) => (
                  <MenuItem
                    key={person.userId}
                    value={person.userId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={
                          spend?.spend_for?.includes(person.userId) || false
                        }
                      />
                      <ListItemText primary={displayPersonName(person)} />
                    </Box>
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{
                        bgcolor: "rgba(255,0,0,0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    >
                      deleted
                    </Typography>
                  </MenuItem>
                ))}
            </TextField>
            <Button variant="outlined" onClick={handleSelectAll}>
              All
            </Button>
          </Stack>
          {/* <TextField
            size="small"
            label="Time"
            name="created_at"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={spend?.created_at}
            onChange={handleChange}
          /> */}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} color="secondary">
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

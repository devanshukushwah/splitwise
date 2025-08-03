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

function DialogTemplate({
  children,
  isOpen,
  onClose,
  onSubmit,
  disabled,
  onSubmitLoading = false,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  title = "Dialog",
  disableActions = false,
}) {
  const dispatch = useApiDispatch();

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    dispatch({ type: ApiContextType.CLOSE_DIALOG });
  };

  return (
    <Dialog open={isOpen} onClose={handleOnClose} fullWidth maxWidth="sm">
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
          {title}
        </Typography>
        <Button
          onClick={handleOnClose}
          sx={{ minWidth: 0, color: "grey.600" }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ mt: AppConstants.GAP }}>{children}</DialogContent>
      {!disableActions && (
        <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
          <Button onClick={handleOnClose} color="secondary">
            {cancelLabel}
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            color="primary"
            loading={onSubmitLoading}
            disabled={disabled}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default DialogTemplate;

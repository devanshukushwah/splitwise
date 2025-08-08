"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DialogTemplate from "./DialogTemplate";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { globalFormatWithLocalize } from "@/utils/DateUtils";
import { getHistory } from "@/api/history";
import App from "next/app";
import { AppConstants } from "@/common/AppConstants";
import { joinList } from "@/utils/ListUtils";
import { styled } from "@mui/material/styles";
import Loader from "./Loader";
import { ApiContextType } from "@/common/ApiContextType";
import LazyInvoke from "@/utils/LazyInvoke";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[100],
}));

const StyledRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ChangeLogBox = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
}));

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  const { peopleNameMap } = useApiState();

  // Define color mapping based on type
  const typeColorMap = {
    added: "success.light",
    updated: "info.light",
    deleted: "error.light",
  };

  const typeTextColorMap = {
    added: "success.contrastText",
    updated: "info.contrastText",
    deleted: "error.contrastText",
  };

  // Lowercase type for mapping
  const typeKey = row.type?.toLowerCase();

  return (
    <>
      <StyledRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{globalFormatWithLocalize(row.created_at)}</TableCell>
        <TableCell>
          <Box
            sx={{
              display: "inline-block",
              px: 1,
              py: 0.5,
              bgcolor: typeColorMap[typeKey] || "primary.light",
              color: typeTextColorMap[typeKey] || "primary.contrastText",
              borderRadius: 1,
              fontWeight: 500,
              fontSize: "0.95em",
              textTransform: "capitalize",
            }}
          >
            {row.type}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {peopleNameMap[row.created_by]}
            </Typography>
          </Box>
        </TableCell>
      </StyledRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ChangeLogBox>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Change Log
              </Typography>
              {row.changes.map((change, idx) => {
                let prevValue, newValue;
                if (change.key === "spend_by" || change.key === "userId") {
                  prevValue = peopleNameMap[change.prev];
                  newValue = peopleNameMap[change.new];
                } else if (change.key === "spend_for") {
                  prevValue = Array.isArray(change.prev)
                    ? joinList(change.prev.map((id) => peopleNameMap[id]))
                    : peopleNameMap[change.prev];
                  newValue = Array.isArray(change.new)
                    ? joinList(change.new.map((id) => peopleNameMap[id]))
                    : peopleNameMap[change.new];
                } else {
                  prevValue = change.prev;
                  newValue = change.new;
                }

                return (
                  <Box key={idx} sx={{ mb: 1, pl: 1 }}>
                    <Typography variant="body2" component="span">
                      <strong>
                        {
                          AppConstants.HISTORY_KEYS[row.collection]?.[
                            change.key
                          ]
                        }
                      </strong>
                      :{" "}
                    </Typography>
                    {change.prev !== undefined && (
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ color: "error.main", fontWeight: 500 }}
                      >
                        {JSON.stringify(prevValue)}
                        {" → "}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "success.main", fontWeight: 500 }}
                    >
                      {JSON.stringify(newValue)}
                    </Typography>
                  </Box>
                );
              })}
            </ChangeLogBox>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const HistoryTable = ({ history }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Modification By</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history?.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function HistoryDialog({ entryId }) {
  const { dialog, loading } = useApiState();
  const dispatch = useApiDispatch();
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    dispatch({ type: ApiContextType.START_FETCH_HISTORY_LOADING });
    try {
      const historyResponse = await getHistory({ entryId });
      if (historyResponse.success) {
        setHistory(historyResponse.data.history);
        LazyInvoke({
          callback: () =>
            dispatch({ type: ApiContextType.STOP_FETCH_HISTORY_LOADING }),
        });
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      dispatch({ type: ApiContextType.STOP_FETCH_HISTORY_LOADING });

      // Handle error appropriately, e.g., show a notification
    }
  };

  useEffect(() => {
    if (dialog.isOpen && dialog.type === "history") {
      fetchHistory();
    }
  }, [dialog.isOpen]);

  return (
    <DialogTemplate isOpen={dialog.isOpen} title="History" disableActions>
      {loading.fetchHistory ? (
        <Loader times={1} height={200} />
      ) : (
        <Box sx={{ minWidth: 400 }}>
          <HistoryTable history={history} />
        </Box>
      )}
    </DialogTemplate>
  );
}

export default HistoryDialog;

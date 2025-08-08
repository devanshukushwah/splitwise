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
import { useApiState } from "@/context/ApiStateContext";
import { globalFormatWithLocalize } from "@/utils/DateUtils";
import { getHistory } from "@/api/history";
import App from "next/app";
import { AppConstants } from "@/common/AppConstants";
import { joinList } from "@/utils/ListUtils";

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  const { peopleNameMap } = useApiState();

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{globalFormatWithLocalize(row.created_at)}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{peopleNameMap[row.created_by]}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1" gutterBottom>
                Change Log:
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
                  <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                    <strong>
                      {AppConstants.HISTORY_KEYS[row.collection]?.[change.key]}
                    </strong>
                    :{" "}
                    {change.prev !== undefined && (
                      <>
                        <span style={{ color: "red" }}>
                          {JSON.stringify(prevValue)}
                        </span>
                        {" → "}
                      </>
                    )}
                    <span style={{ color: "green" }}>
                      {JSON.stringify(newValue)}
                    </span>
                  </Typography>
                );
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const HistoryTable = ({ history }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Date</strong>
            </TableCell>
            <TableCell>
              <strong>Type</strong>
            </TableCell>
            <TableCell>
              <strong>Modification By</strong>
            </TableCell>
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
  const { dialog } = useApiState();
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const historyResponse = await getHistory({ entryId });
      if (historyResponse.success) {
        setHistory(historyResponse.data.history);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      // Handle error appropriately, e.g., show a notification
    }
  };

  useEffect(() => {
    if (dialog.isOpen && dialog.type === "history") {
      fetchHistory();
    }
  }, [dialog.isOpen]);

  return (
    <>
      <DialogTemplate isOpen={dialog.isOpen} title="History" disableActions>
        <HistoryTable history={history} />
      </DialogTemplate>
    </>
  );
}

export default HistoryDialog;

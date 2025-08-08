import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Currency from "./Currency";
import { globalFormatWithLocalize } from "@/utils/DateUtils";
import { useApiState } from "@/context/ApiStateContext";

function SpendTable({ spends, people, onEdit }) {
  const { peopleNameMap } = useApiState();

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, boxShadow: 3 }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Paid By</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Paid For</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spends.map((spend, index) => (
            <TableRow
              key={index}
              sx={{
                "&:hover": { backgroundColor: "#fafafa" },
                transition: "background 0.2s",
              }}
            >
              <TableCell>{spend.title}</TableCell>
              <TableCell>
                <Currency amount={spend.amount} />
              </TableCell>
              <TableCell>
                <Chip
                  label={peopleNameMap[spend.spend_by] || "NA"}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  {spend?.spend_for?.map((userId) => (
                    <Chip
                      key={userId}
                      label={peopleNameMap[userId] || "NA"}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                {globalFormatWithLocalize(spend.created_at)}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="edit"
                  onClick={() => onEdit(spend._id)}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {(!people || spends.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No spend data yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SpendTable;

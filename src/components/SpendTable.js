import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

function SpendTable({ spends, people, onEdit }) {
  const [peopleMap, setPeopleMap] = useState({});

  const getPersonNames = (spendFor) => {
    return spendFor?.map((id) => peopleMap[id] || "Unknown").join(", ");
  };

  useEffect(() => {
    let peopleMap = {};
    for (let obj of people) {
      peopleMap[obj._id] = obj.name;
    }
    setPeopleMap(peopleMap);
  }, [people]);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4, boxShadow: 3 }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Amount (₹)</TableCell>
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
              <TableCell>₹ {spend.amount}</TableCell>
              <TableCell>{peopleMap[spend.spend_by] || "None"}</TableCell>
              <TableCell>{getPersonNames(spend.spend_for) || "None"}</TableCell>
              <TableCell>
                {new Date(spend.created_at).toLocaleString(undefined, {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
          {spends.length === 0 && (
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

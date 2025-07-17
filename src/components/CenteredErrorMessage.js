import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CenteredErrorMessage = ({ message }) => {
  return (
    <Box
      minHeight="70dvh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      px={2}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" color="error">
        {message}
      </Typography>
    </Box>
  );
};

export default CenteredErrorMessage;

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Skeleton, Stack } from "@mui/material";

function Loader({ height = 70, times = 2 }) {
  return (
    <>
      <Stack gap={2}>
        {[...Array(times)].map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={height} />
        ))}
      </Stack>
    </>
  );
}

export default Loader;

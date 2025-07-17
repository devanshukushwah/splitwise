import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Skeleton, Stack } from "@mui/material";

function Loader({ height = 70, times = 2, rounded, width, direction }) {
  return (
    <>
      <Stack gap={2} direction={direction}>
        {[...Array(times)].map((_, idx) =>
          rounded ? (
            <Skeleton variant="rounded" width={width} height={height} />
          ) : (
            <Skeleton
              key={idx}
              variant="rounded"
              height={height}
              width={width}
            />
          )
        )}
      </Stack>
    </>
  );
}

export default Loader;

import { Stack } from "@mui/material";
import React from "react";

function Currency({ amount, rightLabel }) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <span>₹</span>
        <span>
          {Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        {rightLabel && <span>{rightLabel}</span>}
      </Stack>
    </>
  );
}

export default Currency;

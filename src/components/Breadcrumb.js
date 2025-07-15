import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Box, Paper } from "@mui/material";

function Breadcrumb({ links = [] }) {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        {links.map((link, index) => {
          if (link?.isText) {
            return (
              <Typography key={index} sx={{ color: "text.primary" }}>
                {link.label}
              </Typography>
            );
          }
          return (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              href={link.href}
              sx={{ "&:hover": { color: "primary.main" } }}
            >
              {link.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
}

export default Breadcrumb;

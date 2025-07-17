"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";
import { Box, Container } from "@mui/material";
import axios from "axios";
import { Http } from "@mui/icons-material";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";
import Loader from "@/components/Loader";
import Breadcrumb from "@/components/Breadcrumb";

function page() {
  // const breadCrumbList = [
  //   {
  //     label: "Dashboard",
  //     href: "/dashboard",
  //     isText: true,
  //   },
  // ];

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        {/* <Box mb={2}>
          <Breadcrumb links={breadCrumbList} />
        </Box> */}
        <EntryList />
      </Container>
    </>
  );
}

export default page;

"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";
import { Container } from "@mui/material";
import axios from "axios";
import { Http } from "@mui/icons-material";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";
import Loader from "@/components/Loader";

function Dashboard() {
  return (
    <>
      <Container maxWidth="md">
        <EntryList />
      </Container>
    </>
  );
}

function page() {
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}

export default page;

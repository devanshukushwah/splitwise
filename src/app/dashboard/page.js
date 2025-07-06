"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import EntryList from "@/components/EntryList";
import { Container } from "@mui/material";
import axios from "axios";
import { Http } from "@mui/icons-material";
import { HttpUrlConfig } from "@/core/HttpUrlConfig";
import api from "@/lib/axios";

function Dashboard() {
  const [entries, setEntries] = useState([]);

  const handleAddEntry = (entry) => {
    api
      .post(HttpUrlConfig.postEntryUrl(), entry)
      .then((response) => {
        setEntries([{ ...entry, _id: response?.data?.entry_id }, ...entries]);
      })
      .catch((error) => {
        console.error("Error adding entry:", error);
      });
  };

  const fetchEntries = async () => {
    try {
      const response = await api.get(HttpUrlConfig.getEntriesUrl());
      setEntries(response.data.entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <EntryList entries={entries} onAdd={handleAddEntry} />
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

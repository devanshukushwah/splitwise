"use client"; // required for client-side context

import { createContext, useContext, useState } from "react";

const ApiStateContext = createContext();

export const ApiStateProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  // variable for breadcrumb directory path
  const [dirPath, setDirpath] = useState([]);

  const states = {
    people,
    setPeople,
    dirPath,
    setDirpath,
  };

  return (
    <ApiStateContext.Provider value={states}>
      {children}
    </ApiStateContext.Provider>
  );
};

export const useApiState = () => useContext(ApiStateContext);

"use client"; // required for client-side context

import { createContext, useContext, useState } from "react";

const ApiStateContext = createContext();

export const ApiStateProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  return (
    <ApiStateContext.Provider value={{ people, setPeople }}>
      {children}
    </ApiStateContext.Provider>
  );
};

export const useApiState = () => useContext(ApiStateContext);

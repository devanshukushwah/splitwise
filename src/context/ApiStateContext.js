"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { createContext, useReducer, useContext } from "react";

const initialState = { dirPath: [], people: [] };

function apiReducer(state, action) {
  switch (action.type) {
    case ApiContextType.UPDATE_PEOPLE:
      return { ...state, people: action.value };
    case ApiContextType.UPDATE_DIR_PATH:
      return { ...state, dirPath: action.value };
    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
}

const ApiStateContext = createContext();
const ApiDispatchContext = createContext();

export function ApiContextProvider({ children }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  return (
    <ApiStateContext.Provider value={state}>
      <ApiDispatchContext.Provider value={dispatch}>
        {children}
      </ApiDispatchContext.Provider>
    </ApiStateContext.Provider>
  );
}

export function useApiState() {
  const context = useContext(ApiStateContext);
  if (context === undefined) {
    throw new Error("useApiState must be used within a ApiProvider");
  }
  return context;
}

export function useApiDispatch() {
  const context = useContext(ApiDispatchContext);
  if (context === undefined) {
    throw new Error("useApiDispatch must be used within a ApiProvider");
  }
  return context;
}

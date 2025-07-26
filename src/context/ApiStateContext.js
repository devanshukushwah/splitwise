"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { createContext, useReducer, useContext } from "react";

const doPeopleMap = (people) => {
  let peopleMap = {};
  for (let person of people) {
    peopleMap[person._id] = person?.user?.firstName;
  }

  return peopleMap;
};

const initialState = {
  dirPath: [],
  people: [],
  loading: {
    fetchSpend: false,
    fetchPeople: false,
  },
  dialog: {
    isOpen: false,
    type: null,
    data: null,
  },
  peopleMap: {},
};

function apiReducer(state, action) {
  switch (action.type) {
    case ApiContextType.UPDATE_PEOPLE:
      const peopleMap = doPeopleMap(action.value);
      return { ...state, people: action.value, peopleMap };
    case ApiContextType.UPDATE_DIR_PATH:
      return { ...state, dirPath: action.value };
    case ApiContextType.START_FETCH_PEOPLE_LOADING:
      return { ...state, loading: { ...state.loading, fetchPeople: true } };
    case ApiContextType.STOP_FETCH_PEOPLE_LOADING:
      return { ...state, loading: { ...state.loading, fetchPeople: false } };
    case ApiContextType.START_FETCH_SPEND_LOADING:
      return { ...state, loading: { ...state.loading, fetchSpend: true } };
    case ApiContextType.STOP_FETCH_SPEND_LOADING:
      return { ...state, loading: { ...state.loading, fetchSpend: false } };
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

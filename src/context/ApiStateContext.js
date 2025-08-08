"use client";

import { ApiContextType } from "@/common/ApiContextType";
import { createContext, useReducer, useContext } from "react";

const doPeopleNameMap = (people) => {
  let peopleNameMap = {};
  for (let person of people) {
    peopleNameMap[person.userId] = person?.user?.firstName;
  }

  return peopleNameMap;
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
  peopleNameMap: {},
};

function apiReducer(state, action) {
  switch (action.type) {
    case ApiContextType.UPDATE_PEOPLE:
      const peopleNameMap = doPeopleNameMap(action.value);
      return { ...state, people: action.value, peopleNameMap };
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
    case ApiContextType.OPEN_DIALOG:
      return {
        ...state,
        dialog: {
          isOpen: true,
          type: action.value.type,
          data: action.value.data || null,
        },
      };
      break;
    case ApiContextType.CLOSE_DIALOG:
      return {
        ...state,
        dialog: {
          isOpen: false,
          type: null,
          data: null,
        },
      };
      break;
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

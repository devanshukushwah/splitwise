export const AppConstants = {
  TIME_TO_STOP_BUTTON_LOADING: 600,
  SPENDS: "spends",
  PEOPLE: "people",
  USERS: "users",
  ENTRIES: "entries",
  HISTORY: "history",
  OFFLINE: "offline",
  PEOPLE_OFFLINE: "people_offline",
  SPENDS_OFFLINE: "spends_offline",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  GAP: 2,
};

// Now assign dependent keys
AppConstants.HISTORY_KEYS = {
  [AppConstants.SPENDS]: {
    title: "Title",
    amount: "Amount",
    spend_by: "Paid By",
    spend_for: "Paid For",
  },
  [AppConstants.PEOPLE]: {
    userId: "Person Name",
  },
  [AppConstants.ENTRIES]: {
    entryName: "Entry Name",
  },
};

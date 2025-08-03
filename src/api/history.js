const { HttpUrlConfig } = require("@/core/HttpUrlConfig");
const { default: api } = require("@/lib/axios");

export const getHistory = async ({ entryId }) => {
  try {
    const response = await api.get(HttpUrlConfig.getHistoryUrl(entryId));
    return response?.data;
  } catch (error) {
    throw error;
  }
};

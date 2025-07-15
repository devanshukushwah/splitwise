const { HttpUrlConfig } = require("@/core/HttpUrlConfig");
const { default: api } = require("@/lib/axios");

export const postSpend = async ({ entry_id, spend }) => {
  try {
    const response = await api.post(
      HttpUrlConfig.postSpendUrl(entry_id),
      spend
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getSpends = async ({ entry_id }) => {
  try {
    const response = await api.get(HttpUrlConfig.getSpendsUrl(entry_id));
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const putSpend = async ({ entry_id, spend }) => {
  try {
    const response = await api.put(
      HttpUrlConfig.putSpendsUrl(entry_id, spend._id),
      spend
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

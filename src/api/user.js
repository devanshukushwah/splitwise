const { HttpUrlConfig } = require("@/core/HttpUrlConfig");
const { default: api } = require("@/lib/axios");

export const postGuest = async ({ user }) => {
  try {
    const response = await api.post(HttpUrlConfig.getRegisterGuestUrl(), user);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

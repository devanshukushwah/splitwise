const { HttpUrlConfig } = require("@/core/HttpUrlConfig");
const { default: api } = require("@/lib/axios");

export const postPeople = async ({ entry_id, person }) => {
  try {
    const response = await api.post(
      HttpUrlConfig.postPeopleUrl(entry_id),
      person
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getPeople = async ({ entry_id }) => {
  try {
    const response = await api.get(HttpUrlConfig.getPeopleUrl(entry_id));
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deletePeople = async ({ entry_id, person }) => {
  try {
    const response = await api.delete(
      HttpUrlConfig.deletePeopleUrl(entry_id, person._id)
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

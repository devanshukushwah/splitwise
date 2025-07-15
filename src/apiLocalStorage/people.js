import { AppConstants } from "@/common/AppConstants";

// Utility function to get people list from localStorage
const getStoredPeople = (entry_id) => {
  const data = localStorage.getItem(`people_${entry_id}`);
  return data ? JSON.parse(data) : [];
};

// Utility function to save people list to localStorage
const savePeople = (entry_id, people) => {
  localStorage.setItem(`people_${entry_id}`, JSON.stringify(people));
};

// Add person
export const postPeople = async ({ entry_id, person }) => {
  try {
    const people = getStoredPeople(entry_id);
    const gPerson = {
      ...person,
      _id: person._id || Date.now().toString(),
      created_by: AppConstants.OFFLINE,
      created_at: new Date(),
    };
    people.push(gPerson);
    savePeople(entry_id, people);
    return { success: true, data: { person } };
  } catch (error) {
    throw error;
  }
};

// Get people
export const getPeople = async ({ entry_id }) => {
  try {
    const people = getStoredPeople(entry_id);
    return {
      success: true,
      data: { people },
    };
  } catch (error) {
    throw error;
  }
};

// Delete person
export const deletePeople = async ({ entry_id, person }) => {
  try {
    const people = getStoredPeople(entry_id);
    const markIsDeleted = people.map((item) => {
      return item._id === person._id
        ? {
            ...item,
            isDeleted: true,
            changed_at: new Date(),
            changed_by: AppConstants.OFFLINE,
          }
        : item;
    });
    savePeople(entry_id, markIsDeleted);
    return { success: true, message: "person deleted successfully" };
  } catch (error) {
    throw error;
  }
};

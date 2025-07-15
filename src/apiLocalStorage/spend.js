import { AppConstants } from "@/common/AppConstants";

// Utility function to get spend list from localStorage
const getStoredSpends = (entry_id) => {
  const data = localStorage.getItem(`spends_${entry_id}`);
  return data ? JSON.parse(data) : [];
};

// Utility function to save spend list to localStorage
const saveSpends = (entry_id, spends) => {
  localStorage.setItem(`spends_${entry_id}`, JSON.stringify(spends));
};

// Add a spend entry
export const postSpend = async ({ entry_id, spend }) => {
  try {
    const spends = getStoredSpends(entry_id);
    const gSpend = {
      ...spend,
      _id: spend._id || "" + (spends.length + 1),
      created_by: AppConstants.OFFLINE,
      created_at: new Date(),
    };
    spends.push(gSpend);
    saveSpends(entry_id, spends);
    return { success: true, data: { spend: gSpend } };
  } catch (error) {
    throw error;
  }
};

// Get all spend entries
export const getSpends = async ({ entry_id }) => {
  try {
    const spends = getStoredSpends(entry_id);
    return {
      success: true,
      data: { spends },
    };
  } catch (error) {
    throw error;
  }
};

// Update a spend entry
export const putSpend = async ({ entry_id, spend }) => {
  try {
    const spends = getStoredSpends(entry_id);
    const updatedSpends = spends.map((item) =>
      item._id === spend._id
        ? {
            ...item,
            ...spend,
            changed_by: AppConstants.OFFLINE,
            changed_at: new Date(),
          }
        : item
    );
    saveSpends(entry_id, updatedSpends);
    return { success: true, data: { spend } };
  } catch (error) {
    throw error;
  }
};

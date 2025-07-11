// create save and load functions for localStorage
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return undefined;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Error loading from localStorage", error);
    return undefined;
  }
};

export const loadFromLocalStorageElseDefault = (key, defaultValue) => {
  const value = loadFromLocalStorage(key);
  if (value === undefined) {
    return defaultValue;
  } else {
    return value;
  }
};

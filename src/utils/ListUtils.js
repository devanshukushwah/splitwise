export const joinList = (list, separator = ", ") => {
  if (!list || list.length === 0) return "";
  return list.join(separator);
};

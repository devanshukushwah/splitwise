export const displayPersonName = (person) => {
  return person?.user?.firstName || person?.user?.nickName || person?.email;
};

import { guessNameFromEmail } from "./AppUtils";

export const displayPersonName = (person) => {
  return person?.user?.firstName || guessNameFromEmail(person?.email);
};

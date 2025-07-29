export function isValidEmail(email) {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function guessNameFromEmail(email) {
  const localPart = email?.split("@")[0];
  const nameParts = localPart
    ?.replace(/\./g, " ")
    ?.replace(/_/g, " ")
    ?.replace(/\d+/g, "") // Remove digits (optional)
    ?.trim()
    ?.split(/\s+/);

  const capitalized = nameParts.map(
    (part) => part?.charAt(0)?.toUpperCase() + part?.slice(1)?.toLowerCase()
  );

  return capitalized?.join(" ");
}

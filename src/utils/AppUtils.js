export function isValidEmail(email) {
  // Simple email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

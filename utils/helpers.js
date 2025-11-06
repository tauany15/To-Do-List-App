/**
 * Capitalize the first letter of a string
 */
exports.capitalize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format date for display
 */
exports.formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

/**
 * Get current day of week
 */
exports.getCurrentDay = () => {
  const options = { weekday: "long" };
  return new Date().toLocaleDateString("en-US", options);
};

/**
 * Sanitize string for safe display
 */
exports.sanitize = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
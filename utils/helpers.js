function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  // Convert the provided date to a formatted string using the specified options
  return new Date(date).toLocaleDateString(undefined, options);
}

// Export the formatDate function for use in other files
module.exports = { formatDate };
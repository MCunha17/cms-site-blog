// Format date in a readable format
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Truncate text to a specified length
const truncateText = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

module.exports = { formatDate, truncateText };
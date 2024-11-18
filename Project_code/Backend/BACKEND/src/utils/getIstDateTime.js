// Helper function to get only the date in IST
exports.getDateIST = (date) => {
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-IN", options);
};

// Helper function to get only the time in IST
exports.getTimeIST = (date) => {
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date).toLocaleTimeString("en-IN", options);
};

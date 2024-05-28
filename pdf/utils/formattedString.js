function formatDateString(inputString) {
  const parts = inputString.split("-");
  if (parts.length !== 2) {
    return inputString;
  }
  return `${parts[1]}/${parts[0]}`;
}

module.exports = { formatDateString };

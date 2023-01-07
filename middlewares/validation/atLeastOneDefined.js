module.exports = (obj) => {
  if (obj === {}) return false;

  return Object.values(obj).some((value) => value !== undefined);
};

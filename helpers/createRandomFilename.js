module.exports = (file) => {
  const filename = `${file.fieldname}-${Math.round(
    Math.random() * 100000,
  )}-${Date.now()}-${file.originalname}`;

  return filename;
};

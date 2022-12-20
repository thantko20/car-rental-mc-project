const excludeFields = (doc, ...fields) => {
  fields.forEach((field) => {
    doc[field] = undefined;
  });
  return doc;
};

module.exports = excludeFields;

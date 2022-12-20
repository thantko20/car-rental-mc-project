const z = require('zod');
module.exports = (errors) => {
  const formattedErrors = {};
  if (errors instanceof z.ZodError) {
    errors.issues.forEach(
      (issue) => (formattedErrors[issue.path[0]] = issue.message),
    );
  }
  return formattedErrors;
};

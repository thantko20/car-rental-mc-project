const EXLCUDED_FIELDS = Object.freeze(['page', 'sort', 'limit', 'fields']);

class QueryHelper {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const cloneQueryObject = { ...this.queryObject };
    EXLCUDED_FIELDS.forEach((field) => delete cloneQueryObject[field]);

    let queryString = JSON.stringify(cloneQueryObject);

    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`,
    );
    const parsedQuery = JSON.parse(queryString);

    this.query = this.query.find(parsedQuery);

    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.replace(/\,/g, ' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      this.query = this.query.sort(this.queryObject.sort);
    }
  }
}

module.exports = QueryHelper;

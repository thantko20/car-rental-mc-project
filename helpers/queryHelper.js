const EXLCUDED_FIELDS = Object.freeze(['page', 'sort', 'limit', 'fields']);
const DOCS_LIMIT = 20;

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
    return this;
  }

  paginate() {
    const page = this.queryObject.page || 1;
    const limit = this.queryObject.limit || DOCS_LIMIT;
    this.query = this.query.skip(limit * (page - 1)).limit(limit);
    return this;
  }
}

module.exports = QueryHelper;

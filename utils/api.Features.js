import qs from "qs";
export class ApiFeatures {
  constructor(queryStr, builderQuery) {
    this.queryStr = queryStr;
    this.builderQuery = builderQuery;
  }

  filter() {
    const queryObj = qs.parse(this.queryStr);
    console.log(queryObj);
    const queries = ["page", "sort", "limit", "fields", "keyword"];
    queries.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filter = JSON.parse(queryStr);

    this.builderQuery = this.builderQuery.find(filter || {});
    return this;
  }

  pagination(countDocument) {
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 5;
    const skip = (page - 1) * limit;

    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    const countPages = countDocument / limit;
    const endIndex = page * limit;
    if (endIndex < countDocument) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.paginationResult = pagination;

    this.builderQuery = this.builderQuery.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      let splitQuery = this.queryStr.sort.split(",").join(" ");
      this.builderQuery = this.builderQuery.sort(splitQuery);
    } else {
      this.builderQuery = this.builderQuery.sort("-createdAt");
    }
    return this;
  }
1
  limitFields() {
    if (this.queryStr.fields) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryStr.keyword, $options: "i" } },
        { description: { $regex: this.queryStr.keyword, $options: "i" } },
      ];
      this.builderQuery = this.builderQuery.find(query);
    }
    return this;
  }
  search(mainModel) {
    const query = {};
    if(this.queryStr.keyword)
    {
    if (mainModel === "Products") {
      query.$or = [
        { title: { $regex: this.queryStr.keyword, $options: "i" } },
        { description: { $regex: this.queryStr.keyword, $options: "i" } },
      ];
    } else {
   query.$or = [
        { name: { $regex: this.queryStr.keyword, $options: "i" } },
      ];
    }
  }
    this.builderQuery = this.builderQuery.find(query);
    return this;
  }
}

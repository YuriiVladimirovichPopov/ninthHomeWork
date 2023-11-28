export type PaginatedType = {
  pageNumber: number;
  pageSize: number;
  sortDirection: "asc" | "desc";
  sortBy: string;
  skip: number;
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type DefaultPagination = {
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
  skip: number;
};

export type UserPagination = {
  pageNumber: number;
  pageSize: number;
  sortDirection: "asc" | "desc";
  sortBy: string;
  skip: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export const getPaginationFromQuery = (query: any): PaginatedType => {
  const defaultValues: PaginatedType = {
    pageNumber: 1,
    pageSize: 10,
    sortDirection: "desc",
    sortBy: "createdAt",
    skip: 0,
  };
  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }

  if (query.sortDirection && query.sortDirection === "asc") {
    defaultValues.sortDirection = query.sortDirection;
  }

  if (
    query.pageNumber &&
    !isNaN(parseInt(query.pageNumber, 10)) &&
    parseInt(query.pageNumber, 10) > 0
  ) {
    defaultValues.pageNumber = parseInt(query.pageNumber, 10);
  }

  if (
    query.pageSize &&
    !isNaN(parseInt(query.pageSize, 10)) &&
    parseInt(query.pageSize, 10) > 0
  ) {
    defaultValues.pageSize = parseInt(query.pageSize, 10);
  }
  if (query.searchNameTerm) {
    defaultValues.searchNameTerm = query.searchNameTerm;
  }

  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;

  return defaultValues;
};

export const getDefaultPagination = (query: any): DefaultPagination => {
  const defaultValues: DefaultPagination = {
    sortBy: "createdAt",
    sortDirection: "desc", //
    pageNumber: 1, //
    pageSize: 10, //
    skip: 0, //
  };

  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }

  if (query.sortDirection && query.sortDirection === "asc") {
    defaultValues.sortDirection = query.sortDirection;
  }

  if (query.pageNumber && query.pageNumber > 0) {
    defaultValues.pageNumber = +query.pageNumber;
  }

  if (query.pageSize && query.pageSize > 0) {
    defaultValues.pageSize = +query.pageSize;
  }

  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;
  return defaultValues;
};

export const getUsersPagination = (query: any): UserPagination => {
  const defaultValues: UserPagination = {
    ...getDefaultPagination(query),
    searchEmailTerm: "",
    searchLoginTerm: "",
  };

  if (query.searchEmailTerm)
    defaultValues.searchEmailTerm = query.searchEmailTerm;
  if (query.searchLoginTerm)
    defaultValues.searchLoginTerm = query.searchLoginTerm;

  return defaultValues;
};

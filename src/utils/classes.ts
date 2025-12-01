import { Role, Salutation, Status } from "./types";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export interface Page<T> {
  content: T[];
  pageable: {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export const statuses = Object.values(Status).sort();

export const salutations = Object.values(Salutation).sort();

export const roles = Object.values(Role).sort();

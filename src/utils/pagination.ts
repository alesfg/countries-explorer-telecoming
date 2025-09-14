import { Country } from '../types';

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationData;
}

export function paginateArray<T>(
  array: T[],
  page: number,
  itemsPerPage: number
): PaginatedResult<T> {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const data = array.slice(startIndex, endIndex);
  
  const pagination: PaginationData = {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    data,
    pagination,
  };
}

export function createIncrementalData<T>(
  currentData: T[],
  newData: T[],
  keyExtractor: (item: T) => string
): T[] {
  const existingKeys = new Set(currentData.map(keyExtractor));
  const uniqueNewItems = newData.filter(
    item => !existingKeys.has(keyExtractor(item))
  );
  
  return [...currentData, ...uniqueNewItems];
}
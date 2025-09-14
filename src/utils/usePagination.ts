import { useState, useCallback } from 'react';
import { Country } from '../types';
import { paginateArray, createIncrementalData, PaginatedResult } from './pagination';

interface UsePaginationProps {
  itemsPerPage: number;
  initialData?: Country[];
}

interface UsePaginationReturn {
  currentPage: number;
  paginatedData: Country[];
  loadMore: (allData: Country[]) => void;
  reset: () => void;
  hasMore: boolean;
  totalItems: number;
  totalLoaded: number;
}

export function usePagination({ 
  itemsPerPage, 
  initialData = [] 
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<Country[]>(initialData);

  const loadMore = useCallback((allData: Country[]) => {
    const nextPage = currentPage + 1;
    const result = paginateArray(allData, nextPage, itemsPerPage);
    
    if (result.data.length > 0) {
      const updatedData = createIncrementalData(
        paginatedData,
        result.data,
        (country) => country.cca3
      );
      
      setPaginatedData(updatedData);
      setCurrentPage(nextPage);
    }
  }, [currentPage, itemsPerPage, paginatedData]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setPaginatedData([]);
  }, []);

  // Calculate if there are more items to load
  const totalItems = paginatedData.length > 0 ? Math.max(paginatedData.length, itemsPerPage * currentPage) : 0;
  const hasMore = paginatedData.length >= itemsPerPage * currentPage && paginatedData.length > 0;
  
  return {
    currentPage,
    paginatedData,
    loadMore,
    reset,
    hasMore,
    totalItems,
    totalLoaded: paginatedData.length,
  };
}
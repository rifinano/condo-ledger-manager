
import { useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ResidentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ResidentsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: ResidentsPaginationProps) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Generate page numbers to display, with ellipsis for many pages
  const getPageNumbers = useCallback(() => {
    // Always show first and last page
    const pages = [];
    
    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // For many pages, use ellipsis
    pages.push(1);
    
    // Pages around current page
    if (currentPage > 3) {
      pages.push(null); // ellipsis
    }
    
    // Pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push(null); // ellipsis
    }
    
    pages.push(totalPages);
    
    return pages;
  }, [currentPage, totalPages]);

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {pageNumbers.map((pageNumber, index) => 
          pageNumber === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <span className="px-4 py-2">...</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${pageNumber}`}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber as number)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={handleNext}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ResidentsPagination;

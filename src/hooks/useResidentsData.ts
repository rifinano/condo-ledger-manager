
import { useResidentsFetch } from "./residents/useResidentsFetch";
import { useResidentsFilter } from "./residents/useResidentsFilter";
import { useApartmentOccupancy } from "./residents/useApartmentOccupancy";

/**
 * Hook to fetch and filter residents data
 */
export const useResidentsData = (
  setResidents: (residents: Resident[]) => void,
  setIsLoading: (loading: boolean) => void,
  searchTerm: string
) => {
  const {
    fetchResidents,
    allResidents,
    isFetching,
    error,
    totalCount
  } = useResidentsFetch(setResidents, setIsLoading);
  
  const { filterResidents } = useResidentsFilter(searchTerm);
  
  const { isApartmentOccupied } = useApartmentOccupancy(allResidents);

  return {
    fetchResidents,
    filterResidents,
    isApartmentOccupied,
    totalCount,
    isFetching,
    error
  };
};

// Add this import to maintain TypeScript compatibility with the file
import { Resident } from "@/services/residents";

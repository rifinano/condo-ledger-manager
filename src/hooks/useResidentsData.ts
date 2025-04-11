
import { useCallback, useEffect } from "react";
import { getResidents, Resident } from "@/services/residentsService";

/**
 * Hook to fetch and filter residents data
 */
export const useResidentsData = (
  setResidents: (residents: Resident[]) => void,
  setIsLoading: (loading: boolean) => void,
  searchTerm: string
) => {
  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    const data = await getResidents();
    setResidents(data || []);
    setIsLoading(false);
  }, [setResidents, setIsLoading]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const filterResidents = (residents: Resident[]) => {
    return residents.filter(resident => 
      resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.block_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.apartment_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    fetchResidents,
    filterResidents
  };
};

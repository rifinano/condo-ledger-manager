
import { useEffect, useState } from "react";
import { usePropertyFetch } from "./usePropertyFetch";
import { usePropertyHelpers } from "./usePropertyHelpers";
import { usePropertyFormData } from "./usePropertyFormData";

/**
 * Combined hook to manage property data including blocks, apartments, and residents
 */
export const usePropertyData = () => {
  const { 
    blocks, 
    loading, 
    residents, 
    fetchProperties, 
    refreshData: refresh,
    fetchError
  } = usePropertyFetch();
  
  const {
    getBlockNames,
    getApartments,
    isApartmentOccupied,
    getResidentName
  } = usePropertyHelpers(blocks, residents);
  
  const { months, years } = usePropertyFormData();
  
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Wrapper for refresh that also updates the timestamp
  const handleRefreshData = () => {
    refresh();
    setLastRefresh(Date.now());
  };

  return {
    blocks,
    loading,
    fetchProperties,
    refreshData: handleRefreshData,
    isApartmentOccupied,
    getResidentName,
    residents,
    getBlockNames,
    getApartments,
    months,
    years,
    fetchError
  };
};

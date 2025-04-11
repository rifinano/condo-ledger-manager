
import { useCallback } from "react";
import { useResidentsState } from "./useResidentsState";
import { usePropertyData } from "./usePropertyData";
import { useResidentsData } from "./useResidentsData";
import { useResidentActions } from "./useResidentActions";

/**
 * Main hook for the residents page that combines all the smaller hooks
 */
export const useResidentsPage = () => {
  const {
    residents,
    setResidents,
    isLoading,
    setIsLoading,
    searchTerm,
    setSearchTerm,
    isAddingResident,
    setIsAddingResident,
    isEditingResident,
    setIsEditingResident,
    isDeletingResident,
    setIsDeletingResident,
    currentResident,
    setCurrentResident,
    selectedResidentId,
    setSelectedResidentId,
    resetForm
  } = useResidentsState();

  const { 
    blocks, 
    getBlockNames, 
    getApartments, 
    months, 
    years 
  } = usePropertyData();

  const { fetchResidents, filterResidents } = useResidentsData(
    setResidents,
    setIsLoading,
    searchTerm
  );

  const {
    handleAddResident: addResident,
    handleUpdateResident: updateResident,
    handleDeleteResident: deleteResident,
    editResident: editResidentAction,
    confirmDeleteResident: confirmDeleteResidentAction
  } = useResidentActions(fetchResidents, resetForm);

  // Define wrapper functions with useCallback to maintain hook order consistency
  const handleAddResident = useCallback(() => {
    return addResident(currentResident, setIsAddingResident);
  }, [addResident, currentResident, setIsAddingResident]);

  const handleUpdateResident = useCallback(() => {
    return updateResident(selectedResidentId, currentResident, setIsEditingResident);
  }, [updateResident, selectedResidentId, currentResident, setIsEditingResident]);

  const handleDeleteResident = useCallback(() => {
    return deleteResident(selectedResidentId, setIsDeletingResident);
  }, [deleteResident, selectedResidentId, setIsDeletingResident]);
  
  const editResident = useCallback((resident: any) => {
    return editResidentAction(
      resident, 
      setSelectedResidentId, 
      setCurrentResident, 
      setIsEditingResident
    );
  }, [editResidentAction, setSelectedResidentId, setCurrentResident, setIsEditingResident]);

  const confirmDeleteResident = useCallback((resident: any) => {
    return confirmDeleteResidentAction(
      resident,
      setSelectedResidentId,
      setCurrentResident,
      setIsDeletingResident
    );
  }, [confirmDeleteResidentAction, setSelectedResidentId, setCurrentResident, setIsDeletingResident]);

  // Memoize the filtered residents to prevent unnecessary calculations
  const filteredResidents = filterResidents(residents);

  return {
    residents,
    filteredResidents,
    isLoading,
    searchTerm,
    setSearchTerm,
    isAddingResident,
    setIsAddingResident,
    isEditingResident,
    setIsEditingResident,
    isDeletingResident,
    setIsDeletingResident,
    currentResident,
    setCurrentResident,
    selectedResidentId,
    blockNames: getBlockNames(),
    getApartments,
    handleAddResident,
    handleUpdateResident,
    handleDeleteResident,
    editResident,
    confirmDeleteResident,
    resetForm,
    months,
    years,
    fetchResidents
  };
};

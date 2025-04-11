
import { useCallback, useMemo } from "react";
import { useResidentsState } from "./useResidentsState";
import { usePropertyData } from "./usePropertyData";
import { useResidentsData } from "./useResidentsData";
import { useResidentActions } from "./useResidentActions";
import { Resident } from "@/services/residents/types";

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
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetForm
  } = useResidentsState();

  const { 
    blocks, 
    getBlockNames, 
    getApartments, 
    months, 
    years 
  } = usePropertyData();

  const { fetchResidents, filterResidents, totalCount, isFetching } = useResidentsData(
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
  
  const editResident = useCallback((resident: Resident) => {
    return editResidentAction(
      resident, 
      setSelectedResidentId, 
      setCurrentResident, 
      setIsEditingResident
    );
  }, [editResidentAction, setSelectedResidentId, setCurrentResident, setIsEditingResident]);

  const confirmDeleteResident = useCallback((resident: Resident) => {
    return confirmDeleteResidentAction(
      resident,
      setSelectedResidentId,
      setCurrentResident,
      setIsDeletingResident
    );
  }, [confirmDeleteResidentAction, setSelectedResidentId, setCurrentResident, setIsDeletingResident]);

  // Filter residents based on search term
  const filteredResidents = useMemo(() => filterResidents(residents), [filterResidents, residents]);

  // Apply pagination to filtered residents
  const paginatedResidents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredResidents.slice(startIndex, startIndex + pageSize);
  }, [filteredResidents, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(filteredResidents.length / pageSize)),
    [filteredResidents.length, pageSize]
  );

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  return {
    residents,
    filteredResidents,
    paginatedResidents,
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
    fetchResidents,
    currentPage,
    totalPages,
    handlePageChange,
    pageSize,
    setPageSize,
    totalCount,
    isFetching
  };
};

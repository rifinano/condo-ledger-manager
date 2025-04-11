
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

  // Wrapper functions to simplify the API
  const handleAddResident = () => addResident(currentResident, setIsAddingResident);
  const handleUpdateResident = () => updateResident(selectedResidentId, currentResident, setIsEditingResident);
  const handleDeleteResident = () => deleteResident(selectedResidentId, setIsDeletingResident);
  
  const editResident = (resident: any) => editResidentAction(
    resident, 
    setSelectedResidentId, 
    setCurrentResident, 
    setIsEditingResident
  );

  const confirmDeleteResident = (resident: any) => confirmDeleteResidentAction(
    resident,
    setSelectedResidentId,
    setCurrentResident,
    setIsDeletingResident
  );

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

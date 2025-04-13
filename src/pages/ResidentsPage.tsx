import { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useResidentsPage } from "@/hooks/useResidentsPage";
import { usePropertyData } from "@/hooks/usePropertyData";
import ResidentsHeader from "@/components/residents/ResidentsHeader";
import ResidentsContent from "@/components/residents/ResidentsContent";
import ResidentsDialogs from "@/components/residents/ResidentsDialogs";
import ResidentsErrorState from "@/components/residents/ResidentsErrorState";
import { useResidentRefresh } from "@/hooks/residents/useResidentRefresh";
import { useResidentImport } from "@/hooks/residents/useResidentImport";
import { downloadResidentsCsv } from "@/utils/residents/csvUtils";

const ResidentsPage = () => {
  const { refreshData } = usePropertyData();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  
  const {
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
    blockNames,
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
    totalCount,
    isFetching,
    isApartmentOccupied,
    selectedResidentId,
    error: residentsError,
    filteredResidents,
  } = useResidentsPage();

  const {
    isRefreshing,
    hasAttemptedFetch,
    setHasAttemptedFetch,
    handleRetry
  } = useResidentRefresh(fetchResidents, refreshData);

  const handleAddResidentWithRefresh = useCallback(async () => {
    const result = await handleAddResident();
    if (result) refreshData();
    return result;
  }, [handleAddResident, refreshData]);

  const handleUpdateResidentWithRefresh = useCallback(async () => {
    const result = await handleUpdateResident();
    if (result) refreshData();
    return result;
  }, [handleUpdateResident, refreshData]);

  const handleDeleteResidentWithRefresh = useCallback(async () => {
    const result = await handleDeleteResident();
    if (result) refreshData();
    return result;
  }, [handleDeleteResident, refreshData]);

  const importProps = useMemo(() => ({
    months,
    isApartmentOccupied,
    resetForm,
    setCurrentResident,
    handleAddResident: handleAddResidentWithRefresh,
    refreshData,
    fetchResidents
  }), [months, isApartmentOccupied, resetForm, setCurrentResident, 
       handleAddResidentWithRefresh, refreshData, fetchResidents]);

  const {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick,
    handleCreateMissingApartments,
    isCreatingApartments
  } = useResidentImport(importProps);

  const handleDownloadCsv = useCallback(() => {
    downloadResidentsCsv(filteredResidents, months);
  }, [filteredResidents, months]);

  useEffect(() => {
    if (residentsError) setFetchError(residentsError);
  }, [residentsError]);

  useEffect(() => {
    if (!hasAttemptedFetch && !isFetching) {
      const loadData = async () => {
        try {
          setFetchError(null);
          await fetchResidents();
          refreshData();
          setHasAttemptedFetch(true);
        } catch (error) {
          console.error("Error loading resident data:", error);
          setFetchError("Failed to load resident data. Please try again.");
          setHasAttemptedFetch(true);
        }
      };
      
      loadData();
    }
  }, [fetchResidents, refreshData, hasAttemptedFetch, isFetching, setHasAttemptedFetch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ResidentsHeader 
          totalCount={totalCount}
          isLoading={isLoading}
          onAddResident={() => setIsAddingResident(true)}
          onImport={handleImportClick}
          onDownload={handleDownloadCsv}
          onDeleteAll={() => setIsDeleteAllOpen(true)}
        />

        {fetchError ? (
          <ResidentsErrorState 
            fetchError={fetchError}
            isRefreshing={isRefreshing}
            onRetry={handleRetry}
          />
        ) : (
          <ResidentsContent 
            residents={paginatedResidents}
            isLoading={isLoading}
            totalCount={totalCount}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={editResident}
            onDelete={confirmDeleteResident}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            importErrors={importErrors}
            importSuccess={importSuccess}
            isImporting={isImporting || isCreatingApartments}
            onCreateMissingApartments={handleCreateMissingApartments}
          />
        )}
      </div>

      <ResidentsDialogs 
        isAddingResident={isAddingResident}
        setIsAddingResident={setIsAddingResident}
        isEditingResident={isEditingResident}
        setIsEditingResident={setIsEditingResident}
        isDeletingResident={isDeletingResident}
        setIsDeletingResident={setIsDeletingResident}
        isDeleteAllOpen={isDeleteAllOpen}
        setIsDeleteAllOpen={setIsDeleteAllOpen}
        currentResident={currentResident}
        setCurrentResident={setCurrentResident}
        blockNames={blockNames}
        getApartments={getApartments}
        isApartmentOccupied={isApartmentOccupied}
        selectedResidentId={selectedResidentId}
        handleAddResident={handleAddResidentWithRefresh}
        handleUpdateResident={handleUpdateResidentWithRefresh}
        handleDeleteResident={handleDeleteResidentWithRefresh}
        resetForm={resetForm}
        months={months}
        years={years}
        fetchResidents={fetchResidents}
        refreshData={refreshData}
        totalCount={totalCount}
      />
    </DashboardLayout>
  );
};

export default ResidentsPage;

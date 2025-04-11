
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useResidentsPage } from "@/hooks/useResidentsPage";
import AddResidentDialog from "@/components/residents/AddResidentDialog";
import EditResidentDialog from "@/components/residents/EditResidentDialog";
import DeleteResidentDialog from "@/components/residents/DeleteResidentDialog";
import DeleteAllResidentsDialog from "@/components/residents/DeleteAllResidentsDialog";
import ResidentsHeader from "@/components/residents/ResidentsHeader";
import ResidentsContent from "@/components/residents/ResidentsContent";
import { usePropertyData } from "@/hooks/usePropertyData";
import { ErrorMessage } from "@/components/ui/error-message";

const ResidentsPage = () => {
  const { refreshData } = usePropertyData();
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
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
    totalCount
  } = useResidentsPage();

  // Fetch residents data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchError(null);
        await fetchResidents();
        refreshData(); // Also refresh property data to ensure sync
      } catch (error) {
        console.error("Error loading resident data:", error);
        setFetchError("Failed to load resident data. Please try again.");
      }
    };
    
    loadData();
  }, [fetchResidents, refreshData]);

  // Custom handlers that also refresh property data
  const handleAddResidentWithRefresh = async () => {
    const result = await handleAddResident();
    if (result) {
      refreshData();
    }
    return result;
  };

  const handleUpdateResidentWithRefresh = async () => {
    const result = await handleUpdateResident();
    if (result) {
      refreshData();
    }
    return result;
  };

  const handleDeleteResidentWithRefresh = async () => {
    const result = await handleDeleteResident();
    if (result) {
      refreshData();
    }
    return result;
  };

  const handleRetry = async () => {
    try {
      setFetchError(null);
      await fetchResidents();
      refreshData();
    } catch (error) {
      console.error("Error retrying data fetch:", error);
      setFetchError("Failed to load data. Please try again later.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ResidentsHeader 
          totalCount={totalCount}
          isLoading={isLoading}
          onAddResident={() => setIsAddingResident(true)}
          onDeleteAll={() => setIsDeleteAllOpen(true)}
        />

        {fetchError ? (
          <ErrorMessage 
            title="Connection Error" 
            message={fetchError} 
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
          />
        )}
      </div>

      <AddResidentDialog 
        open={isAddingResident}
        onOpenChange={setIsAddingResident}
        currentResident={currentResident}
        setCurrentResident={setCurrentResident}
        blocks={blockNames}
        getApartments={getApartments}
        handleAddResident={handleAddResidentWithRefresh}
        resetForm={resetForm}
        months={months}
        years={years}
      />

      <EditResidentDialog 
        open={isEditingResident}
        onOpenChange={setIsEditingResident}
        currentResident={currentResident}
        setCurrentResident={setCurrentResident}
        blocks={blockNames}
        getApartments={getApartments}
        handleUpdateResident={handleUpdateResidentWithRefresh}
        resetForm={resetForm}
        months={months}
        years={years}
      />

      <DeleteResidentDialog 
        open={isDeletingResident}
        onOpenChange={setIsDeletingResident}
        onConfirm={handleDeleteResidentWithRefresh}
        residentName={currentResident.full_name || ""}
        apartmentInfo={
          currentResident.block_number && currentResident.apartment_number 
            ? `Block ${currentResident.block_number}, Apt ${currentResident.apartment_number}` 
            : ""
        }
      />

      <DeleteAllResidentsDialog 
        open={isDeleteAllOpen}
        onOpenChange={setIsDeleteAllOpen}
        totalCount={totalCount}
        onSuccess={fetchResidents}
        refreshData={refreshData}
      />
    </DashboardLayout>
  );
};

export default ResidentsPage;

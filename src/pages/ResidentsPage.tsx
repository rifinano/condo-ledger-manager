
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useResidentsPage } from "@/hooks/useResidentsPage";
import { usePropertyData } from "@/hooks/usePropertyData";
import ResidentsHeader from "@/components/residents/ResidentsHeader";
import ResidentsContent from "@/components/residents/ResidentsContent";
import ResidentsDialogs from "@/components/residents/ResidentsDialogs";
import ResidentsErrorState from "@/components/residents/ResidentsErrorState";
import { useResidentRefresh } from "@/hooks/residents/useResidentRefresh";
import { Resident } from "@/services/residents/types";

const ResidentsPage = () => {
  const { refreshData } = usePropertyData();
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

  // Set fetch error from the hook's error
  useEffect(() => {
    if (residentsError) {
      setFetchError(residentsError);
    }
  }, [residentsError]);

  // Fetch residents data when the component mounts
  useEffect(() => {
    // Only fetch if we haven't already attempted a fetch
    if (!hasAttemptedFetch && !isFetching) {
      const loadData = async () => {
        try {
          setFetchError(null);
          await fetchResidents();
          refreshData(); // Also refresh property data to ensure sync
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

  const handleDownloadCsv = () => {
    // Use all filtered residents, not just paginated ones
    const residents = filteredResidents;
    if (residents.length === 0) return;

    // Format move-in date for CSV export
    const formatMoveInDate = (resident: Resident) => {
      if (!resident.move_in_month || !resident.move_in_year) {
        return "Not available";
      }
      
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const monthIndex = parseInt(resident.move_in_month, 10) - 1;
      if (monthIndex < 0 || monthIndex >= 12) {
        return "Invalid date";
      }
      
      return `${months[monthIndex]} ${resident.move_in_year}`;
    };

    // Create CSV content
    const headers = ["Name", "Phone", "Block", "Apartment", "Move-in Date"];
    const csvContent = [
      headers.join(","),
      ...residents.map(resident => [
        `"${resident.full_name}"`,
        `"${resident.phone_number || ""}"`,
        `"${resident.block_number}"`,
        `"${resident.apartment_number}"`,
        `"${formatMoveInDate(resident)}"`
      ].join(","))
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `residents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ResidentsHeader 
          totalCount={totalCount}
          isLoading={isLoading}
          onAddResident={() => setIsAddingResident(true)}
          onDownloadCsv={handleDownloadCsv}
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
        isDeleteAllOpen={false} // We're removing the delete all functionality
        setIsDeleteAllOpen={() => {}} // Empty function as we're not using it anymore
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

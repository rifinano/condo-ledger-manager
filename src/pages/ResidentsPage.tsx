
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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ResidentsPage = () => {
  const { refreshData } = usePropertyData();
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
    error: residentsError
  } = useResidentsPage();

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
  }, [fetchResidents, refreshData, hasAttemptedFetch, isFetching]);

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
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      setFetchError(null);
      setHasAttemptedFetch(false); // Allow a new fetch attempt
      await fetchResidents();
      refreshData();
    } catch (error) {
      console.error("Error retrying data fetch:", error);
      setFetchError("Failed to load data. Please try again later.");
    } finally {
      setIsRefreshing(false);
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
          <div className="space-y-4">
            <ErrorMessage 
              title="Connection Error" 
              message={fetchError} 
              onRetry={handleRetry} 
              isNetworkError={true}
            />
            <div className="flex justify-center">
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>
          </div>
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
        isApartmentOccupied={isApartmentOccupied}
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
        isApartmentOccupied={isApartmentOccupied}
        currentResidentId={selectedResidentId}
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

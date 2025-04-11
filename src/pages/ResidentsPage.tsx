
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResidentsPage } from "@/hooks/useResidentsPage";
import AddResidentDialog from "@/components/residents/AddResidentDialog";
import ResidentsTable from "@/components/residents/ResidentsTable";
import ResidentsPagination from "@/components/residents/ResidentsPagination";
import EditResidentDialog from "@/components/residents/EditResidentDialog";
import DeleteResidentDialog from "@/components/residents/DeleteResidentDialog";

const ResidentsPage = () => {
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
    fetchResidents();
  }, [fetchResidents]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
            <p className="text-gray-500 mt-1">Manage resident information</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              className="bg-syndicate-600 hover:bg-syndicate-700"
              onClick={() => setIsAddingResident(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Resident
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Residents ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search residents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ResidentsTable 
              residents={paginatedResidents}
              isLoading={isLoading}
              onEdit={editResident}
              onDelete={confirmDeleteResident}
            />
            
            {totalPages > 1 && (
              <div className="mt-4">
                <ResidentsPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddResidentDialog 
        open={isAddingResident}
        onOpenChange={setIsAddingResident}
        currentResident={currentResident}
        setCurrentResident={setCurrentResident}
        blocks={blockNames}
        getApartments={getApartments}
        handleAddResident={handleAddResident}
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
        handleUpdateResident={handleUpdateResident}
        resetForm={resetForm}
        months={months}
        years={years}
      />

      <DeleteResidentDialog 
        open={isDeletingResident}
        onOpenChange={setIsDeletingResident}
        onConfirm={handleDeleteResident}
        residentName={currentResident.full_name || ""}
        apartmentInfo={
          currentResident.block_number && currentResident.apartment_number 
            ? `Block ${currentResident.block_number}, Apt ${currentResident.apartment_number}` 
            : ""
        }
      />
    </DashboardLayout>
  );
};

export default ResidentsPage;

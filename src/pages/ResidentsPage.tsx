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
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(0);
  
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

  useEffect(() => {
    if (residentsError) {
      setFetchError(residentsError);
    }
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
    const residents = filteredResidents;
    if (residents.length === 0) return;

    const headers = ["Name", "Phone", "Block", "Apartment", "Move-in Month", "Move-in Year"];
    const csvContent = [
      headers.join(","),
      ...residents.map(resident => [
        `"${resident.full_name}"`,
        `"${resident.phone_number || ""}"`,
        `"${resident.block_number}"`,
        `"${resident.apartment_number}"`,
        `"${resident.move_in_month ? months.find(m => m.value === resident.move_in_month)?.label || resident.move_in_month : ""}"`,
        `"${resident.move_in_year || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `residents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      setIsImporting(true);
      setImportErrors([]);
      setImportSuccess(0);
      
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        const dataRows = rows.slice(1).filter(row => row.trim() !== '');
        const errors: string[] = [];
        let successCount = 0;
        
        for (const row of dataRows) {
          const values: string[] = [];
          let inQuotes = false;
          let currentValue = '';
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue);
          
          const cleanValues = values.map(val => val.replace(/^"(.*)"$/, '$1'));
          
          if (cleanValues.length < 4) {
            errors.push(`Invalid data format: ${row}`);
            continue;
          }
          
          const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = cleanValues;
          
          if (isApartmentOccupied(blockNumber, apartmentNumber)) {
            errors.push(`Location Block ${blockNumber}, Apartment ${apartmentNumber} is already occupied by a resident.`);
            continue;
          }
          
          const moveInMonth = months.find(m => m.label === moveInMonthName)?.value || 
                             (moveInMonthName && !isNaN(parseInt(moveInMonthName)) ? 
                              (parseInt(moveInMonthName) < 10 ? `0${parseInt(moveInMonthName)}` : `${parseInt(moveInMonthName)}`) : 
                              undefined);
          
          const residentData = {
            full_name: fullName,
            phone_number: phoneNumber,
            block_number: blockNumber,
            apartment_number: apartmentNumber,
            move_in_month: moveInMonth,
            move_in_year: moveInYear
          };
          
          try {
            resetForm();
            setCurrentResident(residentData);
            const result = await handleAddResidentWithRefresh();
            if (result) {
              successCount++;
            } else {
              errors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber}`);
            }
          } catch (error) {
            errors.push(`Error adding resident: ${fullName}. ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        setImportSuccess(successCount);
        setImportErrors(errors);
        
        if (errors.length === 0) {
          await fetchResidents();
          refreshData();
        }
      } catch (error) {
        console.error("Error processing import:", error);
        setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ResidentsHeader 
          totalCount={totalCount}
          isLoading={isLoading}
          onAddResident={() => setIsAddingResident(true)}
          onDownloadCsv={handleDownloadCsv}
          onImport={handleImportClick}
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
            isImporting={isImporting}
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
        isDeleteAllOpen={false}
        setIsDeleteAllOpen={() => {}}
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

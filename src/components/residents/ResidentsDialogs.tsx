
import { ReactNode } from "react";
import AddResidentDialog from "./AddResidentDialog";
import EditResidentDialog from "./EditResidentDialog";
import DeleteResidentDialog from "./DeleteResidentDialog";
import DeleteAllResidentsDialog from "./DeleteAllResidentsDialog";
import { ResidentFormData } from "@/services/residents/types";

interface ResidentsDialogsProps {
  isAddingResident: boolean;
  setIsAddingResident: (value: boolean) => void;
  isEditingResident: boolean;
  setIsEditingResident: (value: boolean) => void;
  isDeletingResident: boolean;
  setIsDeletingResident: (value: boolean) => void;
  isDeleteAllOpen: boolean;
  setIsDeleteAllOpen: (value: boolean) => void;
  currentResident: Partial<ResidentFormData>;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  blockNames: string[];
  getApartments: (block: string) => string[];
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  selectedResidentId: string | null;
  handleAddResident: () => Promise<boolean>;
  handleUpdateResident: () => Promise<boolean>;
  handleDeleteResident: () => Promise<boolean>;
  resetForm: () => void;
  months: { value: string; label: string }[];
  years: string[];
  fetchResidents: () => Promise<void>;
  refreshData: () => void;
  totalCount: number;
}

const ResidentsDialogs = ({
  isAddingResident,
  setIsAddingResident,
  isEditingResident,
  setIsEditingResident,
  isDeletingResident,
  setIsDeletingResident,
  isDeleteAllOpen,
  setIsDeleteAllOpen,
  currentResident,
  setCurrentResident,
  blockNames,
  getApartments,
  isApartmentOccupied,
  selectedResidentId,
  handleAddResident,
  handleUpdateResident,
  handleDeleteResident,
  resetForm,
  months,
  years,
  fetchResidents,
  refreshData,
  totalCount
}: ResidentsDialogsProps) => {
  return (
    <>
      <AddResidentDialog 
        open={isAddingResident}
        onOpenChange={setIsAddingResident}
        currentResident={currentResident}
        setCurrentResident={setCurrentResident}
        blocks={blockNames}
        getApartments={getApartments}
        isApartmentOccupied={isApartmentOccupied}
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
        isApartmentOccupied={isApartmentOccupied}
        currentResidentId={selectedResidentId}
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

      <DeleteAllResidentsDialog 
        open={isDeleteAllOpen}
        onOpenChange={setIsDeleteAllOpen}
        totalCount={totalCount}
        onSuccess={fetchResidents}
        refreshData={refreshData}
      />
    </>
  );
};

export default ResidentsDialogs;

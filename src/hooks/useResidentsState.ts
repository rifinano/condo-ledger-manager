
import { useState } from "react";
import { ResidentFormData } from "@/services/residents/types";

/**
 * Hook to manage the state for the residents page
 */
export const useResidentsState = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingResident, setIsAddingResident] = useState(false);
  const [isEditingResident, setIsEditingResident] = useState(false);
  const [isDeletingResident, setIsDeletingResident] = useState(false);
  const [currentResident, setCurrentResident] = useState<Partial<ResidentFormData>>({
    full_name: "",
    phone_number: "",
    block_number: "",
    apartment_number: "",
    move_in_month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
    move_in_year: new Date().getFullYear().toString()
  });
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size

  const resetForm = () => {
    setCurrentResident({
      full_name: "",
      phone_number: "",
      block_number: "",
      apartment_number: "",
      move_in_month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
      move_in_year: new Date().getFullYear().toString()
    });
    setSelectedResidentId(null);
  };

  return {
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
  };
};

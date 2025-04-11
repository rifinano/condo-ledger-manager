
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getResidents, 
  addResident, 
  updateResident, 
  deleteResident, 
  Resident, 
  ResidentFormData 
} from "@/services/residentsService";

export const useResidentsPage = () => {
  const { toast } = useToast();
  const [residents, setResidents] = useState<Resident[]>([]);
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

  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    const data = await getResidents();
    setResidents(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const blocks = ["Block A", "Block B", "Block C"];
  
  const getApartments = (block: string) => {
    switch (block) {
      case "Block A":
        return ["A101", "A102", "A103", "A201", "A202", "A203"];
      case "Block B":
        return ["B101", "B102", "B103", "B201", "B202", "B203"];
      case "Block C":
        return ["C101", "C102", "C103", "C201", "C202", "C203"];
      default:
        return [];
    }
  };

  const filteredResidents = residents.filter(resident => 
    resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.block_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = async () => {
    if (!currentResident.full_name || !currentResident.block_number || !currentResident.apartment_number) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await addResident(currentResident as ResidentFormData);
    
    if (result.success) {
      setIsAddingResident(false);
      resetForm();
      fetchResidents();
      toast({
        title: "Resident added",
        description: `${currentResident.full_name} has been added to ${currentResident.block_number}, ${currentResident.apartment_number}`
      });
    } else {
      toast({
        title: "Error adding resident",
        description: result.error || "An error occurred while adding the resident",
        variant: "destructive"
      });
    }
  };

  const handleUpdateResident = async () => {
    if (!selectedResidentId || !currentResident.full_name || !currentResident.block_number || !currentResident.apartment_number) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await updateResident(selectedResidentId, currentResident as ResidentFormData);
    
    if (result.success) {
      setIsEditingResident(false);
      resetForm();
      fetchResidents();
      toast({
        title: "Resident updated",
        description: `${currentResident.full_name}'s information has been updated`
      });
    } else {
      toast({
        title: "Error updating resident",
        description: result.error || "An error occurred while updating the resident",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResident = async () => {
    if (!selectedResidentId) return;

    const result = await deleteResident(selectedResidentId);
    
    if (result.success) {
      setIsDeletingResident(false);
      fetchResidents();
      toast({
        title: "Resident deleted",
        description: "The resident has been removed"
      });
    } else {
      toast({
        title: "Error deleting resident",
        description: result.error || "An error occurred while deleting the resident",
        variant: "destructive"
      });
    }
  };

  const editResident = (resident: Resident) => {
    setSelectedResidentId(resident.id);
    setCurrentResident({
      full_name: resident.full_name,
      phone_number: resident.phone_number || "",
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
      move_in_month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
      move_in_year: new Date().getFullYear().toString()
    });
    setIsEditingResident(true);
  };

  const confirmDeleteResident = (resident: Resident) => {
    setSelectedResidentId(resident.id);
    setCurrentResident({
      full_name: resident.full_name,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number
    });
    setIsDeletingResident(true);
  };

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

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    (new Date().getFullYear() - 2).toString(),
    (new Date().getFullYear() - 1).toString(),
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString()
  ];

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
    blocks,
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

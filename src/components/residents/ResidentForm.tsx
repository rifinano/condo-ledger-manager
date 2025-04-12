
import { ResidentFormData } from "@/services/residents/types";
import ResidentNameInput from "./form/ResidentNameInput";
import PhoneNumberInput from "./form/PhoneNumberInput";
import BlockSelector from "./form/BlockSelector";
import ApartmentSelector from "./form/ApartmentSelector";
import MoveInDateSelector from "./form/MoveInDateSelector";
import RequiredFieldsNote from "./form/RequiredFieldsNote";

interface ResidentFormProps {
  resident: Partial<ResidentFormData>;
  onResidentChange: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  isApartmentOccupied?: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  currentResidentId?: string;
  months: { value: string; label: string }[];
  years: string[];
  isEditing?: boolean;
  showMoveInDate?: boolean;
}

const ResidentForm = ({
  resident,
  onResidentChange,
  blocks,
  getApartments,
  isApartmentOccupied,
  currentResidentId,
  months,
  years,
  isEditing = false,
  showMoveInDate = false
}: ResidentFormProps) => {
  const handleChange = (field: keyof ResidentFormData, value: string) => {
    const updatedResident = { ...resident, [field]: value };
    
    // If changing block, reset apartment if not in the new block's apartments
    if (field === 'block_number') {
      const availableApartments = getApartments(value);
      if (!availableApartments.includes(resident.apartment_number || '')) {
        updatedResident.apartment_number = '';
      }
    }
    
    onResidentChange(updatedResident);
  };

  return (
    <div className="grid gap-4 py-4">
      <ResidentNameInput 
        fullName={resident.full_name || ''} 
        onChange={(value) => handleChange('full_name', value)} 
      />
      
      <PhoneNumberInput 
        phoneNumber={resident.phone_number || ''} 
        onChange={(value) => handleChange('phone_number', value)} 
      />
      
      <BlockSelector 
        blockNumber={resident.block_number || ''} 
        blocks={blocks} 
        onChange={(value) => handleChange('block_number', value)} 
      />
      
      <ApartmentSelector 
        blockNumber={resident.block_number || ''} 
        apartmentNumber={resident.apartment_number || ''} 
        getApartments={getApartments} 
        isApartmentOccupied={isApartmentOccupied} 
        currentResidentId={currentResidentId} 
        onChange={(value) => handleChange('apartment_number', value)} 
      />

      {(!isEditing || showMoveInDate) && (
        <MoveInDateSelector 
          moveInMonth={resident.move_in_month || ''} 
          moveInYear={resident.move_in_year || ''} 
          months={months} 
          years={years} 
          onMonthChange={(value) => handleChange('move_in_month', value)} 
          onYearChange={(value) => handleChange('move_in_year', value)} 
        />
      )}
      
      <RequiredFieldsNote />
    </div>
  );
};

export default ResidentForm;

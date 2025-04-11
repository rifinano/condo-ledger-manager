
import { ResidentFormData } from "@/services/residents/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResidentFormProps {
  resident: Partial<ResidentFormData>;
  onResidentChange: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  months: { value: string; label: string }[];
  years: string[];
  isEditing?: boolean;
}

const ResidentForm = ({
  resident,
  onResidentChange,
  blocks,
  getApartments,
  months,
  years,
  isEditing = false
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fullName" className="text-right">
          Full Name*
        </Label>
        <Input
          id="fullName"
          value={resident.full_name || ''}
          onChange={(e) => handleChange('full_name', e.target.value)}
          className="col-span-3"
          placeholder="Enter resident's full name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone Number
        </Label>
        <Input
          id="phone"
          value={resident.phone_number || ''}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          className="col-span-3"
          placeholder="Enter phone number"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="block" className="text-right">
          Block*
        </Label>
        <Select 
          value={resident.block_number || ''} 
          onValueChange={(value) => handleChange('block_number', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a block" />
          </SelectTrigger>
          <SelectContent>
            {blocks.map(block => (
              <SelectItem key={block} value={block}>{block}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="apartment" className="text-right">
          Apartment*
        </Label>
        <Select 
          value={resident.apartment_number || ''} 
          onValueChange={(value) => handleChange('apartment_number', value)}
          disabled={!resident.block_number}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select an apartment" />
          </SelectTrigger>
          <SelectContent>
            {resident.block_number && getApartments(resident.block_number).map(apt => (
              <SelectItem key={apt} value={apt}>{apt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isEditing && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Move-in Date*
            </Label>
            <div className="col-span-3 flex gap-2">
              <Select 
                value={resident.move_in_month || ''} 
                onValueChange={(value) => handleChange('move_in_month', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={resident.move_in_year || ''} 
                onValueChange={(value) => handleChange('move_in_year', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
      <div className="col-span-full text-xs text-gray-500 mt-1">* Required fields</div>
    </div>
  );
};

export default ResidentForm;

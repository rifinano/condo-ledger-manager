
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ResidentsHeaderProps {
  totalCount: number;
  isLoading: boolean;
  onAddResident: () => void;
}

const ResidentsHeader = ({
  totalCount,
  isLoading,
  onAddResident,
}: ResidentsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
        <p className="text-gray-500 mt-1">Manage resident information</p>
      </div>
      <div className="flex space-x-2">
        <Button 
          className="bg-syndicate-600 hover:bg-syndicate-700"
          onClick={onAddResident}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Resident
        </Button>
      </div>
    </div>
  );
};

export default ResidentsHeader;

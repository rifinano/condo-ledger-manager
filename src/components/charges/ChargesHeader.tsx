
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddChargeDialog from "./AddChargeDialog";
import { ChargeFormData } from "@/services/charges";

interface ChargesHeaderProps {
  onAddCharge: (charge: ChargeFormData) => Promise<boolean>;
  onExportReport: () => void;
}

const ChargesHeader = ({ onAddCharge, onExportReport }: ChargesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Charges</h1>
        <p className="text-gray-500 mt-1">Manage property charges and fees</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onExportReport}>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
        
        <AddChargeDialog onAddCharge={onAddCharge} />
      </div>
    </div>
  );
};

export default ChargesHeader;

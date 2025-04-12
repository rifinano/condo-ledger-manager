
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Charge, ChargeFormData } from "@/services/charges";

interface EditChargeFormProps {
  charge: Charge;
  onSuccess: () => void;
  onCancel: () => void;
  onUpdate: (id: string, data: ChargeFormData) => Promise<boolean>;
}

const EditChargeForm = ({ charge, onSuccess, onCancel, onUpdate }: EditChargeFormProps) => {
  const [formData, setFormData] = useState<ChargeFormData>({
    name: charge.name,
    amount: charge.amount,
    description: charge.description || "",
    charge_type: charge.charge_type,
    period: charge.period
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await onUpdate(charge.id, formData);
    
    setIsSubmitting(false);
    if (success) {
      onSuccess();
    }
  };

  const chargeTypes = ["Resident", "Syndicate", "Maintenance"];
  const periodTypes = ["Monthly", "Quarterly", "Annual", "One-time"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Charge Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="charge_type">Charge Type</Label>
          <Select
            value={formData.charge_type}
            onValueChange={(value) => setFormData({ ...formData, charge_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select charge type" />
            </SelectTrigger>
            <SelectContent>
              {chargeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select
            value={formData.period}
            onValueChange={(value) => setFormData({ ...formData, period: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periodTypes.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Enter a description for this charge"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditChargeForm;

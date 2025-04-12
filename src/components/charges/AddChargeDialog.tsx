
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface ChargeFormData {
  name: string;
  amount: string;
  description: string;
  period: string;
  chargeType: string;
}

interface AddChargeDialogProps {
  onAddCharge: (charge: ChargeFormData) => void;
}

const AddChargeDialog = ({ onAddCharge }: AddChargeDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ChargeFormData>({
    name: "",
    amount: "",
    description: "",
    period: "Monthly",
    chargeType: "Resident"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    onAddCharge(formData);
    setFormData({
      name: "",
      amount: "",
      description: "",
      period: "Monthly",
      chargeType: "Resident"
    });
    setOpen(false);

    toast({
      title: "Charge added",
      description: "The new charge has been added successfully"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Charge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Charge</DialogTitle>
          <DialogDescription>
            Create a new charge that can be applied to payments
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chargeType" className="text-right">
                Charge Type
              </Label>
              <Select 
                value={formData.chargeType} 
                onValueChange={(value) => setFormData({...formData, chargeType: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select charge type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resident">Resident</SelectItem>
                  <SelectItem value="Syndicate">Syndicate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="period" className="text-right">
                Period
              </Label>
              <Select 
                value={formData.period} 
                onValueChange={(value) => setFormData({...formData, period: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Charge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChargeDialog;

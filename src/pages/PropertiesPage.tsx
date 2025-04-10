
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, Home, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data structure
interface Block {
  id: string;
  name: string;
  apartmentCount: number;
  apartments: Apartment[];
}

interface Apartment {
  id: string;
  number: string;
  floor: number;
  occupied: boolean;
}

const PropertiesPage = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      name: "Block A",
      apartmentCount: 10,
      apartments: Array.from({ length: 10 }, (_, i) => ({
        id: `A${i + 1}`,
        number: `A${i + 1}`,
        floor: Math.floor(i / 4) + 1,
        occupied: Math.random() > 0.3,
      })),
    },
    {
      id: "2",
      name: "Block B",
      apartmentCount: 15,
      apartments: Array.from({ length: 15 }, (_, i) => ({
        id: `B${i + 1}`,
        number: `B${i + 1}`,
        floor: Math.floor(i / 5) + 1,
        occupied: Math.random() > 0.3,
      })),
    },
  ]);
  
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockApartments, setNewBlockApartments] = useState("10");
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const handleAddBlock = () => {
    if (!newBlockName || !newBlockApartments) {
      toast({
        title: "Missing information",
        description: "Please provide both block name and number of apartments",
        variant: "destructive",
      });
      return;
    }

    const apartmentCount = parseInt(newBlockApartments);
    if (isNaN(apartmentCount) || apartmentCount <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of apartments must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const newBlock: Block = {
      id: Date.now().toString(),
      name: newBlockName,
      apartmentCount,
      apartments: Array.from({ length: apartmentCount }, (_, i) => ({
        id: `${newBlockName}${i + 1}`,
        number: `${newBlockName}${i + 1}`,
        floor: Math.floor(i / 4) + 1,
        occupied: false,
      })),
    };

    setBlocks([...blocks, newBlock]);
    setNewBlockName("");
    setNewBlockApartments("10");
    setIsAddingBlock(false);
    
    toast({
      title: "Block added",
      description: `${newBlockName} with ${apartmentCount} apartments has been added`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-500 mt-1">Manage your blocks and apartments</p>
          </div>
          <Dialog open={isAddingBlock} onOpenChange={setIsAddingBlock}>
            <DialogTrigger asChild>
              <Button className="bg-syndicate-600 hover:bg-syndicate-700">
                <Plus className="mr-2 h-4 w-4" /> Add Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Block</DialogTitle>
                <DialogDescription>
                  Add a new residential block with apartments
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="block-name" className="text-right">
                    Block Name
                  </Label>
                  <Input
                    id="block-name"
                    value={newBlockName}
                    onChange={(e) => setNewBlockName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Block C"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apartment-count" className="text-right">
                    Apartments
                  </Label>
                  <Input
                    id="apartment-count"
                    type="number"
                    value={newBlockApartments}
                    onChange={(e) => setNewBlockApartments(e.target.value)}
                    className="col-span-3"
                    min="1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingBlock(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddBlock}>
                  Add Block
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {blocks.map((block) => (
            <Card key={block.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-syndicate-600" />
                    <CardTitle>{block.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {block.apartmentCount} apartments | {
                    block.apartments.filter(apt => apt.occupied).length
                  } occupied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Apartment</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.apartments.slice(0, 5).map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium flex items-center">
                          <Home className="h-4 w-4 mr-2 text-gray-500" />
                          {apt.number}
                        </TableCell>
                        <TableCell>{apt.floor}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            apt.occupied 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {apt.occupied ? "Occupied" : "Vacant"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {block.apartments.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                          + {block.apartments.length - 5} more apartments
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesPage;

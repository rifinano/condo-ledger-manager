
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, Home, Edit, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Block, 
  Apartment, 
  getBlocks, 
  getApartmentsByBlockId, 
  addBlock, 
  deleteBlock,
  getResidentByApartment
} from "@/services/propertiesService";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const PropertiesPage = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<(Block & { apartments: Apartment[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockApartments, setNewBlockApartments] = useState("10");
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [isEditingApartment, setIsEditingApartment] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);
  const [residents, setResidents] = useState<Record<string, any>>({});

  // Fetch blocks and apartments
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const blocksData = await getBlocks();
      
      const blocksWithApartments = await Promise.all(
        blocksData.map(async (block) => {
          const apartments = await getApartmentsByBlockId(block.id);
          return { ...block, apartments };
        })
      );
      
      setBlocks(blocksWithApartments);
      
      // Fetch residents for each apartment
      const residentsMap: Record<string, any> = {};
      
      for (const block of blocksWithApartments) {
        for (const apartment of block.apartments) {
          const resident = await getResidentByApartment(block.name, apartment.number);
          if (resident) {
            const key = `${block.name}-${apartment.number}`;
            residentsMap[key] = resident;
          }
        }
      }
      
      setResidents(residentsMap);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddBlock = async () => {
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

    setLoading(true);
    try {
      const result = await addBlock(newBlockName, apartmentCount);
      if (result) {
        await fetchProperties();
        setNewBlockName("");
        setNewBlockApartments("10");
        setIsAddingBlock(false);
        
        toast({
          title: "Block added",
          description: `${newBlockName} with ${apartmentCount} apartments has been added`,
        });
      }
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        title: "Error",
        description: "Failed to add block.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBlock = (blockId: string) => {
    setCurrentBlockId(blockId);
    setIsDeletingBlock(true);
  };

  const handleDeleteBlock = async () => {
    if (!currentBlockId) return;
    
    setLoading(true);
    try {
      const success = await deleteBlock(currentBlockId);
      if (success) {
        await fetchProperties();
        setIsDeletingBlock(false);
        setCurrentBlockId(null);
        
        toast({
          title: "Block deleted",
          description: "The block and its apartments have been deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting block:", error);
      toast({
        title: "Error",
        description: "Failed to delete block.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditApartment = (apartment: Apartment) => {
    setCurrentApartment(apartment);
    setIsEditingApartment(true);
  };

  const isApartmentOccupied = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    return !!residents[key];
  };

  const getResidentName = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    const resident = residents[key];
    return resident ? resident.full_name : null;
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
                <Button 
                  type="button" 
                  onClick={handleAddBlock}
                  disabled={loading}
                >
                  Add Block
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading && blocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading properties...</p>
          </div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No blocks found</h3>
            <p className="text-gray-500 mt-1">Add a block to get started</p>
          </div>
        ) : (
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => confirmDeleteBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {block.apartments.length} apartments | {
                      block.apartments.filter(apt => 
                        isApartmentOccupied(block.name, apt.number)
                      ).length
                    } occupied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Apartment</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead>Resident</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {block.apartments.slice(0, 5).map((apt) => {
                        const occupied = isApartmentOccupied(block.name, apt.number);
                        const residentName = getResidentName(block.name, apt.number);
                        return (
                          <TableRow key={apt.id}>
                            <TableCell className="font-medium flex items-center">
                              <Home className="h-4 w-4 mr-2 text-gray-500" />
                              {apt.number}
                            </TableCell>
                            <TableCell>{apt.floor}</TableCell>
                            <TableCell>
                              {residentName ? (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1 text-syndicate-600" />
                                  {residentName}
                                </div>
                              ) : (
                                <span className="text-gray-400">No resident</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {occupied ? (
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Occupied
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  Vacant
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditApartment(apt)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {block.apartments.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-sm text-gray-500">
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
        )}
      </div>

      {/* Delete Block Dialog */}
      <AlertDialog open={isDeletingBlock} onOpenChange={setIsDeletingBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the block and all of its apartments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBlock}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Apartment Sheet */}
      <Sheet open={isEditingApartment} onOpenChange={setIsEditingApartment}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Apartment</SheetTitle>
            <SheetDescription>
              {currentApartment && (
                <div className="mt-2">
                  <p className="text-sm">
                    Apartment: <span className="font-medium">{currentApartment.number}</span>
                  </p>
                  <p className="text-sm">
                    Floor: <span className="font-medium">{currentApartment.floor}</span>
                  </p>
                  
                  {blocks.map(block => 
                    block.apartments.some(apt => apt.id === currentApartment.id) && (
                      <p key={block.id} className="text-sm">
                        Block: <span className="font-medium">{block.name}</span>
                      </p>
                    )
                  )}
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Editing apartment details will be available in a future update.",
                });
              }}
            >
              Edit Details
            </Button>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Current Resident</h4>
              {currentApartment && blocks.map(block => {
                if (block.apartments.some(apt => apt.id === currentApartment.id)) {
                  const resident = getResidentName(block.name, currentApartment.number);
                  return resident ? (
                    <div key={block.id} className="p-3 border rounded-md mb-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-syndicate-600" />
                        <p className="font-medium">{resident}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={block.id} className="p-3 border rounded-md mb-3 text-gray-500">
                      No resident assigned
                    </div>
                  );
                }
                return null;
              })}
              
              <Button 
                className="w-full mt-4"
                variant="outline"
                onClick={() => {
                  setIsEditingApartment(false);
                  toast({
                    title: "Navigate to Residents",
                    description: "To assign residents to apartments, please use the Residents page.",
                  });
                }}
              >
                Manage Residents
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default PropertiesPage;

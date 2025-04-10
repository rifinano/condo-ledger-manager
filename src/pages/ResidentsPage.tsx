
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Plus, MoreHorizontal, Upload, Download, 
  User, Phone, Building2, Home 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data structure
interface Resident {
  id: string;
  fullName: string;
  phone: string;
  block: string;
  apartment: string;
  moveInDate: string;
}

const ResidentsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingResident, setIsAddingResident] = useState(false);
  const [isImportingCSV, setIsImportingCSV] = useState(false);
  const [newResident, setNewResident] = useState<Partial<Resident>>({
    fullName: "",
    phone: "",
    block: "",
    apartment: "",
    moveInDate: new Date().toISOString().split("T")[0]
  });

  // Mock residents data
  const [residents, setResidents] = useState<Resident[]>([
    {
      id: "1",
      fullName: "John Doe",
      phone: "+1 (555) 123-4567",
      block: "Block A",
      apartment: "A101",
      moveInDate: "2022-06-15"
    },
    {
      id: "2",
      fullName: "Jane Smith",
      phone: "+1 (555) 987-6543",
      block: "Block A",
      apartment: "A205",
      moveInDate: "2023-02-10"
    },
    {
      id: "3",
      fullName: "Michael Johnson",
      phone: "+1 (555) 456-7890",
      block: "Block B",
      apartment: "B302",
      moveInDate: "2021-11-22"
    },
    {
      id: "4",
      fullName: "Sarah Williams",
      phone: "+1 (555) 234-5678",
      block: "Block B",
      apartment: "B110",
      moveInDate: "2023-07-05"
    }
  ]);

  // Mock blocks and apartments
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
    resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResident = () => {
    if (!newResident.fullName || !newResident.phone || !newResident.block || !newResident.apartment) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const resident: Resident = {
      id: Date.now().toString(),
      fullName: newResident.fullName,
      phone: newResident.phone,
      block: newResident.block,
      apartment: newResident.apartment,
      moveInDate: newResident.moveInDate || new Date().toISOString().split("T")[0]
    };

    setResidents([...residents, resident]);
    setNewResident({
      fullName: "",
      phone: "",
      block: "",
      apartment: "",
      moveInDate: new Date().toISOString().split("T")[0]
    });
    setIsAddingResident(false);

    toast({
      title: "Resident added",
      description: `${resident.fullName} has been added to ${resident.block}, ${resident.apartment}`
    });
  };

  const handleImportCSV = () => {
    // This would be implemented with a file upload in a real application
    toast({
      title: "CSV Import",
      description: "CSV import functionality would be implemented here"
    });
    setIsImportingCSV(false);
  };

  const handleExportCSV = () => {
    toast({
      title: "CSV Export",
      description: "Residents data has been exported to CSV"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
            <p className="text-gray-500 mt-1">Manage resident information</p>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Import/Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsImportingCSV(true)}>
                  <Upload className="mr-2 h-4 w-4" /> Import CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isAddingResident} onOpenChange={setIsAddingResident}>
              <DialogTrigger asChild>
                <Button className="bg-syndicate-600 hover:bg-syndicate-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Resident
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Resident</DialogTitle>
                  <DialogDescription>
                    Enter resident details to add them to your property
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={newResident.fullName}
                      onChange={(e) => setNewResident({...newResident, fullName: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={newResident.phone}
                      onChange={(e) => setNewResident({...newResident, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="block" className="text-right">
                      Block
                    </Label>
                    <Select 
                      value={newResident.block} 
                      onValueChange={(value) => setNewResident({...newResident, block: value, apartment: ""})}
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
                      Apartment
                    </Label>
                    <Select 
                      value={newResident.apartment} 
                      onValueChange={(value) => setNewResident({...newResident, apartment: value})}
                      disabled={!newResident.block}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select an apartment" />
                      </SelectTrigger>
                      <SelectContent>
                        {newResident.block && getApartments(newResident.block).map(apt => (
                          <SelectItem key={apt} value={apt}>{apt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="moveInDate" className="text-right">
                      Move-in Date
                    </Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={newResident.moveInDate}
                      onChange={(e) => setNewResident({...newResident, moveInDate: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingResident(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddResident}>
                    Add Resident
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isImportingCSV} onOpenChange={setIsImportingCSV}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Residents from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with resident information
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input id="csvFile" type="file" accept=".csv" className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    The CSV should have columns: Full Name, Phone, Block, Apartment
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportingCSV(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportCSV}>
                    Import
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Residents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search residents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Move-in Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {resident.fullName}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {resident.phone}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                          {resident.block}
                          <span className="mx-1">/</span>
                          <Home className="h-4 w-4 mr-1 text-gray-500" />
                          {resident.apartment}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(resident.moveInDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResidentsPage;

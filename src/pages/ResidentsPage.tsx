
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Plus, MoreHorizontal, 
  User, Phone, Building2, Home,
  Edit, Trash2
} from "lucide-react";
import { useResidentsPage } from "@/hooks/useResidentsPage";
import ResidentForm from "@/components/residents/ResidentForm";
import DeleteResidentDialog from "@/components/residents/DeleteResidentDialog";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PaymentFormActions from "@/components/payments/PaymentFormActions";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const ResidentsPage = () => {
  const { toast } = useToast();
  const {
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
    blocks,
    getApartments,
    handleAddResident,
    handleUpdateResident,
    handleDeleteResident,
    editResident,
    confirmDeleteResident,
    resetForm,
    months,
    years
  } = useResidentsPage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
            <p className="text-gray-500 mt-1">Manage resident information</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isAddingResident} onOpenChange={(open) => {
              setIsAddingResident(open);
              if (!open) resetForm();
            }}>
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
                <ResidentForm
                  resident={currentResident}
                  onResidentChange={setCurrentResident}
                  blocks={blocks}
                  getApartments={getApartments}
                  months={months}
                  years={years}
                />
                <PaymentFormActions
                  onCancel={() => setIsAddingResident(false)}
                  onSubmit={handleAddResident}
                />
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Loading residents...
                    </TableCell>
                  </TableRow>
                ) : filteredResidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {resident.full_name}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {resident.phone_number || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                          {resident.block_number}
                          <span className="mx-1">/</span>
                          <Home className="h-4 w-4 mr-1 text-gray-500" />
                          {resident.apartment_number}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editResident(resident)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => confirmDeleteResident(resident)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
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

      {/* Edit Resident Dialog */}
      <Dialog open={isEditingResident} onOpenChange={(open) => {
        setIsEditingResident(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>
              Update resident information
            </DialogDescription>
          </DialogHeader>
          <ResidentForm
            resident={currentResident}
            onResidentChange={setCurrentResident}
            blocks={blocks}
            getApartments={getApartments}
            months={months}
            years={years}
            isEditing={true}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingResident(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateResident}>
              Update Resident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resident Dialog */}
      <DeleteResidentDialog
        open={isDeletingResident}
        onOpenChange={setIsDeletingResident}
        onConfirm={handleDeleteResident}
        residentName={currentResident.full_name || ""}
        apartmentInfo={`${currentResident.block_number || ""}, ${currentResident.apartment_number || ""}`}
      />

    </DashboardLayout>
  );
};

export default ResidentsPage;

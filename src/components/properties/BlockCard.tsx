import React, { memo, useState, useEffect } from "react";
import { Building2, Home, Trash2, User, Edit, ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Block, Apartment } from "@/services/properties";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlockCardProps {
  block: Block & { apartments: Apartment[] };
  onDeleteBlock: (blockId: string) => void;
  onEditApartment: (apartment: Apartment) => void;
  onUpdateBlockName: (blockId: string, newName: string) => Promise<boolean>;
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
}

const BlockCard: React.FC<BlockCardProps> = memo(({
  block,
  onDeleteBlock,
  onEditApartment,
  onUpdateBlockName,
  isApartmentOccupied,
  getResidentName
}) => {
  const [showAllApartments, setShowAllApartments] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [blockLetter, setBlockLetter] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const { toast } = useToast();
  
  const blockLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const blockNumbers = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  
  useEffect(() => {
    if (block.name) {
      const matches = block.name.match(/Block ([A-Z])(?:(\d+))?/);
      if (matches) {
        setBlockLetter(matches[1] || "");
        setBlockNumber(matches[2] || "");
      }
    }
  }, [block.name]);

  const sortedApartments = React.useMemo(() => {
    return [...block.apartments].sort((a, b) => {
      const numA = parseInt(a.number.replace(/\D/g, ''), 10);
      const numB = parseInt(b.number.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }, [block.apartments]);

  const occupiedCount = React.useMemo(() => {
    return block.apartments.filter(apt => 
      isApartmentOccupied(block.name, apt.number)
    ).length;
  }, [block.apartments, block.name, isApartmentOccupied]);

  const displayedApartments = showAllApartments 
    ? sortedApartments 
    : sortedApartments.slice(0, 5);

  const toggleShowAll = () => {
    setShowAllApartments(!showAllApartments);
  };

  const handleDeleteBlock = () => {
    const hasOccupiedApartments = block.apartments.some(apt => 
      isApartmentOccupied(block.name, apt.number)
    );

    if (hasOccupiedApartments) {
      toast({
        title: "Cannot delete block",
        description: "This block has occupied apartments. Please reassign or delete all residents before deleting this block.",
        variant: "destructive"
      });
      return;
    }

    onDeleteBlock(block.id);
  };

  const startEditingName = () => {
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    const matches = block.name.match(/Block ([A-Z])(?:(\d+))?/);
    if (matches) {
      setBlockLetter(matches[1] || "");
      setBlockNumber(matches[2] || "");
    }
    setIsEditingName(false);
  };

  const saveBlockName = async () => {
    if (!blockLetter) {
      toast({
        title: "Invalid name",
        description: "Block letter is required",
        variant: "destructive"
      });
      return;
    }

    const newName = blockNumber 
      ? `Block ${blockLetter}${blockNumber}` 
      : `Block ${blockLetter}`;
    
    const success = await onUpdateBlockName(block.id, newName);
    if (success) {
      setIsEditingName(false);
      toast({
        title: "Block updated",
        description: `Block name has been updated to "${newName}"`,
      });
    }
  };

  const handleApartmentEdit = (apt: Apartment) => {
    onEditApartment(apt);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-syndicate-600" />
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <div className="flex space-x-2">
                  <div className="w-24">
                    <Select value={blockLetter} onValueChange={setBlockLetter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Letter" />
                      </SelectTrigger>
                      <SelectContent>
                        {blockLetters.map(letter => (
                          <SelectItem key={letter} value={letter}>
                            {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Select value={blockNumber} onValueChange={setBlockNumber}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="no-number" value="">None</SelectItem>
                        {blockNumbers.map(number => (
                          <SelectItem key={number} value={number}>
                            {number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={saveBlockName}
                  className="p-1 h-8 w-8"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={cancelEditingName}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <CardTitle>{block.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={startEditingName}
                  className="ml-2 p-1 h-7 w-7"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={handleDeleteBlock}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
        <CardDescription>
          {block.apartments.length} apartments | {occupiedCount} occupied
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apartment</TableHead>
              <TableHead>Resident</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedApartments.map((apt) => {
              const occupied = isApartmentOccupied(block.name, apt.number);
              const residentName = occupied ? getResidentName(block.name, apt.number) : null;
              
              return (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium flex items-center">
                    <Home className="h-4 w-4 mr-2 text-gray-500" />
                    {apt.number}
                  </TableCell>
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
                      onClick={() => handleApartmentEdit(apt)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {block.apartments.length > 5 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleShowAll}
              className="text-syndicate-600"
            >
              {showAllApartments ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> 
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> 
                  Show All {block.apartments.length} Apartments
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BlockCard.displayName = "BlockCard";

export default BlockCard;

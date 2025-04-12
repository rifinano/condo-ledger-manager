
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteBlockButtonProps {
  onDelete: () => void;
}

const DeleteBlockButton: React.FC<DeleteBlockButtonProps> = ({ onDelete }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-red-600 hover:text-red-700"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4 mr-1" /> Delete
    </Button>
  );
};

export default DeleteBlockButton;

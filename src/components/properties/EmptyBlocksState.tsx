
import React from "react";
import { Building2 } from "lucide-react";

const EmptyBlocksState: React.FC = () => {
  return (
    <div className="text-center py-8 border rounded-lg">
      <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No blocks found</h3>
      <p className="text-gray-500 mt-1">Add a block to get started</p>
    </div>
  );
};

export default EmptyBlocksState;

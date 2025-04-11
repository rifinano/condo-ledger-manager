
import React from "react";
import { Building2 } from "lucide-react";

const EmptyBlocksState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Building2 className="h-6 w-6 text-gray-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No blocks</h3>
      <p className="mt-2 text-sm text-gray-500">
        You haven't added any blocks yet. Add a block to get started.
      </p>
    </div>
  );
};

export default EmptyBlocksState;

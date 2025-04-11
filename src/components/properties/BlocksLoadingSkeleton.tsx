
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BlocksLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlocksLoadingSkeleton;

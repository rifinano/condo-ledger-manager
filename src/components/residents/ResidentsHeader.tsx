
import { Button } from "@/components/ui/button";
import { PlusIcon, DownloadIcon, UploadIcon, Trash2 } from "lucide-react";

interface ResidentsHeaderProps {
  totalCount: number;
  isLoading: boolean;
  onAddResident: () => void;
  onImport: () => void;
  onDownload: () => void;
  onDeleteAll?: () => void;
}

const ResidentsHeader = ({
  totalCount,
  isLoading,
  onAddResident,
  onImport,
  onDownload,
  onDeleteAll
}: ResidentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Residents</h1>
        <p className="text-muted-foreground">
          {isLoading ? (
            "Loading residents..."
          ) : (
            `Total: ${totalCount} resident${totalCount !== 1 ? 's' : ''}`
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onImport}
        >
          <UploadIcon className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
          disabled={totalCount === 0}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
        {onDeleteAll && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDeleteAll}
            disabled={totalCount === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        )}
        <Button 
          size="sm" 
          onClick={onAddResident}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Resident
        </Button>
      </div>
    </div>
  );
};

export default ResidentsHeader;

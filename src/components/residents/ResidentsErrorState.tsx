
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { RefreshCw } from "lucide-react";

interface ResidentsErrorStateProps {
  fetchError: string | null;
  isRefreshing: boolean;
  onRetry: () => Promise<void>;
}

const ResidentsErrorState = ({
  fetchError,
  isRefreshing,
  onRetry,
}: ResidentsErrorStateProps) => {
  if (!fetchError) return null;
  
  return (
    <div className="space-y-4">
      <ErrorMessage 
        title="Connection Error" 
        message={fetchError} 
        onRetry={onRetry} 
        isNetworkError={true}
      />
      <div className="flex justify-center">
        <Button 
          onClick={onRetry} 
          variant="outline" 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
    </div>
  );
};

export default ResidentsErrorState;

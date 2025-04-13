
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for handling network errors in a consistent way
 */
export const useNetworkErrorHandler = () => {
  const { toast } = useToast();

  /**
   * Handle network errors with appropriate toast messages
   */
  const handleNetworkError = (error: unknown, context: string = "Operation") => {
    console.error(`${context} error:`, error);
    
    // Try to determine if it's a network connectivity issue
    let isConnectivityIssue = false;
    let errorMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      isConnectivityIssue = error.message.toLowerCase().includes('network') || 
                            error.message.toLowerCase().includes('connect') ||
                            error.message.toLowerCase().includes('timeout') ||
                            !navigator.onLine;
    } else if (typeof error === 'string') {
      errorMessage = error;
      isConnectivityIssue = error.toLowerCase().includes('network') || 
                            error.toLowerCase().includes('connect') ||
                            error.toLowerCase().includes('timeout') ||
                            !navigator.onLine;
    }
    
    if (isConnectivityIssue) {
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again",
        variant: "destructive"
      });
    } else {
      toast({
        title: `${context} Failed`,
        description: errorMessage.length > 100 ? 
          errorMessage.substring(0, 100) + "..." : 
          errorMessage,
        variant: "destructive"
      });
    }
  };

  return { handleNetworkError };
};

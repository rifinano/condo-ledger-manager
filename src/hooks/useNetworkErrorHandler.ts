
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useNetworkErrorHandler = () => {
  const handleNetworkError = useCallback((error: any, fallbackMessage: string) => {
    console.error("Network error:", error);
    
    // Determine if it's a CORS error
    const isCorsError = error instanceof Error && 
      (error.message.includes('CORS') || 
       error.message.includes('NetworkError') ||
       error.message.includes('network request failed'));
    
    // Custom message based on error type
    let errorMessage = fallbackMessage;
    
    if (isCorsError) {
      errorMessage = "A network connection error occurred. Please check your internet connection.";
    } else if (error?.response?.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    // Show toast notification
    toast({
      title: "Network Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return null;
  }, []);
  
  return { handleNetworkError };
};

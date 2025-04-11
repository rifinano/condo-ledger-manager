
import { AlertCircle, WifiOff } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

export function ErrorMessage({ 
  title = "An error occurred", 
  message, 
  onRetry,
  isNetworkError = false
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-center">
      {isNetworkError ? (
        <WifiOff className="h-12 w-12 text-red-500 mb-2" />
      ) : (
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
      )}
      <h3 className="text-lg font-semibold text-red-700 mb-2">{title}</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="border-red-200 hover:bg-red-100 hover:text-red-700"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

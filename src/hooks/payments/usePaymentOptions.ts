import { useMemo } from "react";
import { Resident } from "@/services/payments/types";
import { usePropertyData } from "@/hooks/usePropertyData";

/**
 * Hook to provide payment options like methods, types, and blocks
 */
export const usePaymentOptions = (residents: Resident[] = []) => {
  // Get property data to sync with
  const { blocks: propertyBlocks } = usePropertyData();

  // Get unique blocks from both residents and properties for consistency
  const blocks = useMemo(() => {
    // Start with "all" option
    const blockSet = new Set(["all"]);
    
    // Add blocks from residents
    if (residents && residents.length > 0) {
      residents.forEach((resident: Resident) => {
        if (resident.block_number) {
          blockSet.add(resident.block_number);
        }
      });
    }
    
    // Add blocks from properties data
    if (propertyBlocks && propertyBlocks.length > 0) {
      propertyBlocks.forEach((block) => {
        if (block.name) {
          blockSet.add(block.name);
        }
      });
    }
    
    return Array.from(blockSet);
  }, [residents, propertyBlocks]);

  // Payment methods for the form (keep this hardcoded list)
  const paymentMethods = ["Cash", "Bank Transfer", "Check", "Credit Card", "Mobile Payment"];
  
  // We're removing the hardcoded payment types, as we'll get them from the charges table
  const paymentTypes: string[] = [];

  return {
    blocks,
    paymentMethods,
    paymentTypes,
  };
};

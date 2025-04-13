
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseApartmentCreationProps {
  refreshData: () => Promise<void>;
  fetchResidents: () => Promise<void>;
  importErrors: string[];
}

export const useApartmentCreation = ({
  refreshData,
  fetchResidents,
  importErrors
}: UseApartmentCreationProps) => {
  const [isCreatingApartments, setIsCreatingApartments] = useState(false);
  const { toast } = useToast();

  const handleCreateMissingApartments = useCallback(async (blockName: string, apartmentNumbers: string[]) => {
    if (isCreatingApartments) return;
    setIsCreatingApartments(true);

    try {
      // Get the block ID
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('id')
        .eq('name', blockName)
        .maybeSingle();
      
      if (blockError || !block) {
        throw new Error(`Block ${blockName} not found`);
      }

      // Create a batch of apartments
      const newApartments = apartmentNumbers.map(number => ({
        block_id: block.id.toString(),
        number,
        floor: Math.ceil(parseInt(number) / 4), // Calculate floor based on apartment number
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('apartments')
        .insert(newApartments)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Apartments Created",
        description: `Successfully created ${data.length} apartments in Block ${blockName}`,
      });

      // Clear the errors related to these apartments
      const shouldSuggestReimport = importErrors.some(error => 
        error.includes(`Apartment`) && 
        error.includes(`does not exist in Block ${blockName}`) &&
        apartmentNumbers.some(apt => error.includes(`Apartment ${apt}`))
      );

      // Refresh data and trigger a retry of the import
      await refreshData();
      await fetchResidents();

      // If there are any residents waiting to be imported to the newly created apartments, 
      // suggest to the user to try the import again
      if (shouldSuggestReimport) {
        toast({
          title: "Ready to Import",
          description: `Apartments have been created. Please try importing your CSV file again.`,
        });
      }

    } catch (error) {
      console.error("Error creating apartments:", error);
      toast({
        title: "Error Creating Apartments",
        description: error instanceof Error ? error.message : "Failed to create apartments",
        variant: "destructive"
      });
    } finally {
      setIsCreatingApartments(false);
    }
  }, [isCreatingApartments, refreshData, fetchResidents, toast, importErrors]);

  return {
    isCreatingApartments,
    handleCreateMissingApartments
  };
};

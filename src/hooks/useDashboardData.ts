import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalBlocks: number | null;
  totalApartments: number | null;
  totalResidents: number | null;
  recentTransactionsSummary: any[] | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const [totalBlocks, setTotalBlocks] = useState<number | null>(null);
  const [totalApartments, setTotalApartments] = useState<number | null>(null);
  const [totalResidents, setTotalResidents] = useState<number | null>(null);
  const [recentTransactionsSummary, setRecentTransactionsSummary] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [blocksCount, apartmentsCount, residentsCount, transactions] = await Promise.all([
          getTotalBlocksCount(),
          getTotalApartmentsCount(),
          getTotalResidentsCount(),
          getRecentTransactionsSummary()
        ]);

        setTotalBlocks(blocksCount);
        setTotalApartments(apartmentsCount);
        setTotalResidents(residentsCount);
        setRecentTransactionsSummary(transactions);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTotalBlocksCount = async () => {
    try {
      const { count, error } = await supabase
        .from('blocks')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count !== null ? count : 0;
    } catch (error: any) {
      console.error("Error fetching total blocks count:", error);
      throw new Error(error.message || 'Failed to load total blocks count');
    }
  };

  const getTotalApartmentsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('apartments')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count !== null ? count : 0;
    } catch (error: any) {
      console.error("Error fetching total apartments count:", error);
      throw new Error(error.message || 'Failed to load total apartments count');
    }
  };

  const getTotalResidentsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('residents')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return count !== null ? count : 0;
    } catch (error: any) {
      console.error("Error fetching total residents count:", error);
      throw new Error(error.message || 'Failed to load total residents count');
    }
  };

  const getRecentTransactionsSummary = async () => {
    try {
      const { data: blocks, error: blocksError } = await supabase
        .from('blocks')
        .select('id, name');

      if (blocksError) {
        throw blocksError;
      }

      if (!blocks) {
        return [];
      }

      const transactionsSummary = await Promise.all(
        blocks.map(async (block) => {
          // Make the block.id to string conversion explicit
          const { data: apartmentsByBlock } = await supabase
            .from('apartments')
            .select('*')
            .eq('block_id', block.id.toString()); // Convert block.id to string

          const apartmentCount = apartmentsByBlock?.length || 0;

          const { data: residentsByBlock } = await supabase
            .from('residents')
            .select('*')
            .eq('block_number', block.name);

          const residentCount = residentsByBlock?.length || 0;

          return {
            blockName: block.name,
            apartmentCount,
            residentCount,
          };
        })
      );

      return transactionsSummary;
    } catch (error: any) {
      console.error("Error fetching recent transactions summary:", error);
      throw new Error(error.message || 'Failed to load recent transactions summary');
    }
  };

  return {
    totalBlocks,
    totalApartments,
    totalResidents,
    recentTransactionsSummary,
    loading,
    error,
  };
};

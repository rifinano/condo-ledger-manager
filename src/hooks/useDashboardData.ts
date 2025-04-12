
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DashboardStats {
  totalBlocks: number;
  totalApartments: number;
  totalResidents: number;
  pendingPayments: number;
  collectionRate: number;
  monthlyRevenue: number;
  paymentsByBlock: {
    blockName: string;
    totalApartments: number;
    paidCount: number;
    pendingCount: number;
  }[];
}

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBlocks: 0,
    totalApartments: 0,
    totalResidents: 0,
    pendingPayments: 0,
    collectionRate: 0,
    monthlyRevenue: 0,
    paymentsByBlock: []
  });
  const { toast } = useToast();

  // Get current month and year
  const currentMonth = new Date().getMonth() + 1;
  const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  const currentYear = new Date().getFullYear().toString();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch blocks
      const { data: blocks, error: blocksError } = await supabase
        .from('blocks')
        .select('id, name');
      
      if (blocksError) throw new Error(`Error fetching blocks: ${blocksError.message}`);
      
      // Fetch apartments count
      const { count: apartmentsCount, error: apartmentsError } = await supabase
        .from('apartments')
        .select('*', { count: 'exact', head: true });
        
      if (apartmentsError) throw new Error(`Error fetching apartments: ${apartmentsError.message}`);
      
      // Fetch residents
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .select('*');
        
      if (residentsError) throw new Error(`Error fetching residents: ${residentsError.message}`);
      
      // Fetch payments for current month
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_for_month', formattedMonth)
        .eq('payment_for_year', currentYear);
        
      if (paymentsError) throw new Error(`Error fetching payments: ${paymentsError.message}`);
      
      // Calculate payment metrics
      const pendingPayments = payments ? payments.filter(p => p.payment_status === 'unpaid').length : 0;
      const paidPayments = payments ? payments.filter(p => p.payment_status === 'paid').length : 0;
      const totalPayments = payments ? payments.length : 0;
      const collectionRate = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;
      const monthlyRevenue = payments 
        ? payments
            .filter(p => p.payment_status === 'paid')
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
        : 0;
      
      // Calculate payments by block
      const paymentsByBlock = blocks ? await Promise.all(blocks.map(async (block) => {
        // Get all residents in this block
        const blockResidents = residents ? residents.filter(r => r.block_number === block.name) : [];
        
        // Count apartments in this block
        const { count: blockApartments } = await supabase
          .from('apartments')
          .select('*', { count: 'exact', head: true })
          .eq('block_id', block.id);
        
        // Get all payments for residents in this block
        const blockResidentIds = blockResidents.map(r => r.id);
        const blockPayments = payments ? payments.filter(p => blockResidentIds.includes(p.resident_id)) : [];
        
        // Count paid and pending payments
        const blockPaidPayments = blockPayments.filter(p => p.payment_status === 'paid').length;
        const blockPendingPayments = blockPayments.filter(p => p.payment_status === 'unpaid').length;
        
        return {
          blockName: block.name,
          totalApartments: blockApartments || 0,
          paidCount: blockPaidPayments,
          pendingCount: blockPendingPayments
        };
      })) : [];
      
      // Update stats
      setStats({
        totalBlocks: blocks ? blocks.length : 0,
        totalApartments: apartmentsCount || 0,
        totalResidents: residents ? residents.length : 0,
        pendingPayments,
        collectionRate,
        monthlyRevenue,
        paymentsByBlock
      });
      
      toast({
        title: "Dashboard updated",
        description: "Latest data has been loaded",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : String(error));
      toast({
        title: "Error updating dashboard",
        description: error instanceof Error ? error.message : "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up a refresh interval
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, error, refreshData: fetchDashboardData };
};

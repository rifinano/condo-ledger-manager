
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";

interface MonthlyStatsProps {
  stats: {
    paymentsByBlock: {
      blockName: string;
      totalApartments: number;
      paidCount: number;
      pendingCount: number;
    }[];
  };
  isLoading: boolean;
}

const MonthlyStats = ({ stats, isLoading }: MonthlyStatsProps) => {
  // Format chart data
  const chartData = stats.paymentsByBlock.map(block => ({
    name: block.blockName,
    paid: block.paidCount,
    pending: block.pendingCount,
  }));

  const currentMonthName = format(new Date(), "MMMM yyyy");

  return (
    <Card className="col-span-7">
      <CardHeader>
        <CardTitle>Monthly Collection Rate - {currentMonthName}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar 
                dataKey="paid" 
                name="Paid" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="pending" 
                name="Pending" 
                fill="#fb923c" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No data available for this month</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyStats;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, AlertCircle, CheckCircle2, DollarSign, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboardData } from "@/hooks/useDashboardData";
import { format } from "date-fns";

const DashboardPage = () => {
  const { stats, isLoading, error, refreshData } = useDashboardData();
  
  // Format the current month name
  const currentMonthName = format(new Date(), "MMMM yyyy");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome to your Condo Ledger management panel</p>
          </div>
          <Button 
            variant="outline" 
            onClick={refreshData} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlocks} Blocks</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalApartments} apartments in total
              </p>
              {isLoading && <Progress className="h-1 mt-1" value={80} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                Across all blocks and apartments
              </p>
              {isLoading && <Progress className="h-1 mt-1" value={80} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              {stats.pendingPayments > 0 ? (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingPayments} Pending
              </div>
              <div className="mt-2">
                <Progress value={stats.collectionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.collectionRate}% collection rate this month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>
              Monthly payment status across all properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Current Month</h3>
                    <p className="text-sm text-muted-foreground">{currentMonthName}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-bold text-lg">${stats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded animate-pulse">
                        <div>
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-4 w-12 bg-gray-200 rounded"></div>
                          <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))
                  ) : stats.paymentsByBlock.length > 0 ? (
                    stats.paymentsByBlock.map((block, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-medium">{block.blockName}</h4>
                          <p className="text-xs text-muted-foreground">{block.totalApartments} apartments</p>
                        </div>
                        <div className="flex space-x-2">
                          <div className="text-sm">
                            <span className="font-semibold text-green-600">{block.paidCount}</span> Paid
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-orange-600">{block.pendingCount}</span> Pending
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No payment data available for this month
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="yearly">
                <div className="h-64 flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">
                    Yearly payment data visualization will appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

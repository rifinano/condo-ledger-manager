
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Building2, CreditCard, Currency, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { toast } = useToast();
  const [syndicateName, setSyndicateName] = useState("Condo Ledger Manager");
  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [adminPhone, setAdminPhone] = useState("+1 (555) 123-4567");
  const [defaultPaymentAmount, setDefaultPaymentAmount] = useState("250");
  const [currency, setCurrency] = useState("USD");

  const handleSaveProfile = () => {
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated",
    });
  };

  const handleSavePaymentSettings = () => {
    toast({
      title: "Payment settings saved",
      description: "Your payment configuration has been updated",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and application settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Property
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your administrator profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Name</Label>
                  <Input
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Phone Number</Label>
                  <Input
                    id="adminPhone"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    toast({
                      title: "Password changed",
                      description: "Your password has been updated successfully",
                    })
                  }
                >
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Update your syndicate and property details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="syndicateName">Syndicate Name</Label>
                  <Input
                    id="syndicateName"
                    value={syndicateName}
                    onChange={(e) => setSyndicateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syndicateAddress">Address</Label>
                  <Input id="syndicateAddress" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="syndicateCity">City</Label>
                    <Input id="syndicateCity" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="syndicatePostalCode">Postal Code</Label>
                    <Input id="syndicatePostalCode" placeholder="Postal Code" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    toast({
                      title: "Property information saved",
                      description: "Your property details have been updated",
                    })
                  }
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure your payment and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentAmount">Default Payment Amount</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                      <Currency className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="defaultPaymentAmount"
                      type="number"
                      value={defaultPaymentAmount}
                      onChange={(e) => setDefaultPaymentAmount(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Currency code (e.g., USD, EUR, GBP)
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="paymentDueDay">Payment Due Day</Label>
                  <Input
                    id="paymentDueDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="15"
                  />
                  <p className="text-sm text-muted-foreground">
                    Day of the month when payments are due
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePaymentSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

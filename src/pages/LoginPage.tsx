
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { login, signup } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(email, password);
      // Session state and navigation handled in auth context
    } catch (error: any) {
      console.error("Sign up error:", error);
      // Error toast shown in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigation is handled in the login function
    } catch (error) {
      console.error("Login error:", error);
      // Error toast is shown in the login function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-syndicate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-syndicate-600 p-3 rounded-full">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-syndicate-900">Condo Ledger Manager</h1>
          <p className="text-gray-500 mt-2">Manage your syndicate with ease</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isSigningUp ? "Create Account" : "Admin Login"}</CardTitle>
            <CardDescription>
              {isSigningUp 
                ? "Enter your details to create an account" 
                : "Enter your credentials to access the dashboard"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={isSigningUp ? handleSignUp : handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-syndicate-600 hover:bg-syndicate-700"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isSigningUp ? "Creating Account..." : "Logging in...") 
                  : (isSigningUp ? "Create Account" : "Login")}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  setIsSigningUp(!isSigningUp);
                  setEmail("");
                  setPassword("");
                }}
              >
                {isSigningUp 
                  ? "Already have an account? Login" 
                  : "Don't have an account? Sign up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {!isSigningUp && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials: admin@example.com / password</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

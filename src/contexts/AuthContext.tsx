
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if we have admin data in localStorage
  useState(() => {
    const storedAdmin = localStorage.getItem("syndicateAdmin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  });

  // In a real app, this would validate against a backend
  const login = async (email: string, password: string) => {
    // Mock login for demo purposes
    // In a production app, this would call an API endpoint
    if (email === "admin@example.com" && password === "password") {
      const adminData: Admin = {
        id: "1",
        email: email,
        name: "Syndicate Admin",
      };
      
      // Set admin in state and localStorage
      setAdmin(adminData);
      localStorage.setItem("syndicateAdmin", JSON.stringify(adminData));
      
      toast({
        title: "Login successful",
        description: "Welcome back to the Syndicate Manager",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("syndicateAdmin");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

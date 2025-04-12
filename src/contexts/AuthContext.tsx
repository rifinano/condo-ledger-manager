
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  session: Session | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from Supabase
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const adminData: Admin = {
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            name: "Syndicate Admin",
          };
          setAdmin(adminData);
          localStorage.setItem("syndicateAdmin", JSON.stringify(adminData));
        } else {
          setAdmin(null);
          localStorage.removeItem("syndicateAdmin");
        }
      }
    );

    // Then get the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const adminData: Admin = {
          id: currentSession.user.id,
          email: currentSession.user.email || "",
          name: "Syndicate Admin",
        };
        setAdmin(adminData);
        localStorage.setItem("syndicateAdmin", JSON.stringify(adminData));
      }
    });

    // Clean up the subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Session and user state will be updated by the auth state listener
      toast({
        title: "Login successful",
        description: "Welcome back to the Syndicate Manager",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Skip email verification for now
          emailRedirectTo: window.location.origin,
          data: {
            name: "Syndicate Admin", 
          }
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // If we have a session, the user was automatically signed in
        // This happens when email confirmation is disabled in Supabase
        toast({
          title: "Account created successfully",
          description: "Welcome to the Syndicate Manager",
        });
        navigate("/dashboard");
      } else {
        // If no session, email verification might be required
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account before logging in.",
        });
        // Stay on the login page for the user to log in after verification
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Sign up failed",
        description: error?.message || "There was a problem creating your account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Session and user state will be updated by the auth state listener
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!session,
        login,
        signup,
        logout,
        session,
        user
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

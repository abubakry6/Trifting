"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Role } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase is connected, listen to auth state changes
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || "");
        } else {
          loadLocalSession();
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchSupabaseProfile(session.user.id, session.user.email || "");
        } else {
          loadLocalSession();
        }
      });

      return () => subscription.unsubscribe();
    } else {
      loadLocalSession();
    }
  }, []);

  const fetchSupabaseProfile = async (id: string, email: string) => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        setUser({
          id: data.id,
          email: data.email,
          fullName: data.fullName || email.split("@")[0],
          phoneNumber: data.phoneNumber || "",
          role: (data.role as Role) || "customer",
          avatarUrl: data.avatarUrl,
        });
      } else {
        // fallback create profile
        setUser({
          id,
          email,
          fullName: email.split("@")[0],
          role: "customer",
        });
      }
    } catch {
      loadLocalSession();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalSession = () => {
    try {
      const saved = localStorage.getItem("trifting_user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default guest user
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, explicitRole: Role = "customer") => {
    const dummyUser: UserProfile = {
      id: "usr-" + Date.now(),
      email,
      fullName: email.split("@")[0],
      role: email.toLowerCase().includes("admin") ? "admin" : explicitRole,
      phoneNumber: "081234567890",
    };

    setUser(dummyUser);
    try {
      localStorage.setItem("trifting_user", JSON.stringify(dummyUser));
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Selamat datang, ${dummyUser.fullName}! (${dummyUser.role === "admin" ? "Super Admin" : "Customer"})`,
    };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    try {
      localStorage.removeItem("trifting_user");
    } catch {
      // ignore
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem("trifting_user", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const role = user?.role || "customer";
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

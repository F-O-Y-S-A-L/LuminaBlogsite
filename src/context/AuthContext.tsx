'use client';

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  
  const value: AuthContextType = {
    user: session?.user ? {
      id: (session.user as any).id,
      username: session.user.name || '',
      email: session.user.email || '',
      role: (session.user as any).role || 'user',
      bio: (session.user as any).bio,
      avatar: (session.user as any).avatar,
    } : null,
    loading: status === "loading",
    login: () => {
      // Re-fetch handled by next-auth
    },
    logout: async () => {
      await nextAuthSignOut({ callbackUrl: '/' });
    },
    updateUser: async () => {
      await update();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

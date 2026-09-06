'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Passenger } from '@/types';
import { useToast } from './ToastContext';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  walletBalance: number;
  savedPassengers: Omit<Passenger, 'id'>[];
  openLoginModal: (redirectUrl?: string | React.MouseEvent) => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  register: (profileData: any) => Promise<boolean>;
  rechargeWallet: (amount: number) => void;
  addSavedPassenger: (p: Omit<Passenger, 'id'>) => void;
  removeSavedPassenger: (index: number) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PASSENGERS: Omit<Passenger, 'id'>[] = [
  { name: 'Rahul Sharma', age: 34, gender: 'M', berthPreference: 'LB', foodPreference: 'VEG' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [savedPassengers, setSavedPassengers] = useState<Omit<Passenger, 'id'>[]>(DEFAULT_PASSENGERS);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  // Try to load user from backend on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('irctc_token');
      if (token) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          const res = await fetch(`${apiUrl}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setWalletBalance(data.walletBalance || 0);
          } else {
            localStorage.removeItem('irctc_token');
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      try {
        const storedPassengers = localStorage.getItem('irctc_saved_passengers');
        if (storedPassengers) {
          setSavedPassengers(JSON.parse(storedPassengers));
        }
      } catch (e) {}
    };
    fetchMe();
  }, []);

  const openLoginModal = (redirectUrl?: string | React.MouseEvent) => {
    if (typeof redirectUrl === 'string') {
      setPendingRedirectUrl(redirectUrl);
    } else {
      setPendingRedirectUrl(null);
    }
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    router.push('/register');
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast('error', 'Login Failed', data.detail || 'Invalid username or password');
        return false;
      }
      
      localStorage.setItem('irctc_token', data.access_token);
      setUser(data.user);
      setWalletBalance(data.user.walletBalance || 0);
      setIsLoginModalOpen(false);
      showToast('success', 'Logged in successfully', `Welcome back, ${data.user.fullName}`);
      
      if (pendingRedirectUrl) {
        router.push(pendingRedirectUrl);
        setPendingRedirectUrl(null);
      }
      return true;
    } catch (e) {
      showToast('error', 'Network Error', 'Failed to connect to the server');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('irctc_token');
    showToast('info', 'Logged out', 'You have been safely signed out of your account.');
  };

  const register = async (profileData: any): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast('error', 'Registration Failed', data.detail || 'Could not complete registration');
        return false;
      }
      
      // Auto login after register
      return await login(profileData.username, profileData.password);
    } catch (e) {
      showToast('error', 'Network Error', 'Failed to connect to the server');
      return false;
    }
  };

  const rechargeWallet = (amount: number) => {
    // In a real app this would hit the backend too, 
    // but for now we just update local state for demonstration
    const newBal = walletBalance + amount;
    setWalletBalance(newBal);
    showToast('success', 'Wallet Recharged', `₹${amount} credited. Updated balance: ₹${newBal}`);
  };

  const addSavedPassenger = (p: Omit<Passenger, 'id'>) => {
    const updated = [...savedPassengers, p];
    setSavedPassengers(updated);
    localStorage.setItem('irctc_saved_passengers', JSON.stringify(updated));
    showToast('success', 'Passenger Added', `${p.name} added to Master Passenger List.`);
  };

  const removeSavedPassenger = (index: number) => {
    const updated = savedPassengers.filter((_, i) => i !== index);
    setSavedPassengers(updated);
    localStorage.setItem('irctc_saved_passengers', JSON.stringify(updated));
    showToast('info', 'Passenger Removed', 'Passenger removed from Master List.');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data } as UserProfile;
    setUser(updated);
    showToast('success', 'Profile Updated', 'Your profile details have been saved successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoginModalOpen,
        isRegisterModalOpen,
        walletBalance,
        savedPassengers,
        openLoginModal,
        closeLoginModal,
        openRegisterModal,
        closeRegisterModal,
        login,
        logout,
        register,
        rechargeWallet,
        addSavedPassenger,
        removeSavedPassenger,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

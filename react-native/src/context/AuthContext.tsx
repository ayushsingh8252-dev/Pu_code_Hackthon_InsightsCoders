import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VerificationStatus = 'PENDING' | 'APPROVED' | null;

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  verificationStatus: VerificationStatus;
  setIsLoggedIn: (v: boolean) => void;
  setToken: (t: string | null) => void;
  setVerificationStatus: (v: VerificationStatus) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');
      const loginTime = await AsyncStorage.getItem('loginTime');
      const status = await AsyncStorage.getItem('verificationStatus');

      if (!storedToken || !loginTime) return;

      const diff = Date.now() - Number(loginTime);

      if (diff < 3600 * 1000) {
        setToken(storedToken);
        setVerificationStatus(status as VerificationStatus);
        setIsLoggedIn(true);
      } else {
        await logout();
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    setToken(null);
    setVerificationStatus(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        verificationStatus,
        setIsLoggedIn,
        setToken,
        setVerificationStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

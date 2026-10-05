import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ShippingAddress } from '../types/ecommerce.ts';
import { MOCK_USERS } from '../data/mockProducts.ts';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isAdmin: boolean;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  continueAsGuest: (email?: string) => void;
  logout: () => void;
  updateUserAddress: (address: ShippingAddress) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auracommerce_user');
      return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Alex Rivera by default
    } catch {
      return MOCK_USERS[0];
    }
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('auracommerce_is_guest');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auracommerce_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auracommerce_user');
    }
    localStorage.setItem('auracommerce_is_guest', JSON.stringify(isGuest));
  }, [user, isGuest]);

  const loginAsCustomer = () => {
    setUser(MOCK_USERS[0]);
    setIsGuest(false);
  };

  const loginAsAdmin = () => {
    setUser(MOCK_USERS[1]);
    setIsGuest(false);
  };

  const continueAsGuest = (email?: string) => {
    setUser(null);
    setIsGuest(true);
    if (email) {
      sessionStorage.setItem('auracommerce_guest_email', email);
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
  };

  const updateUserAddress = (address: ShippingAddress) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: [address, ...(user.addresses?.filter(a => a.addressLine1 !== address.addressLine1) || [])]
      };
      setUser(updatedUser);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      isAdmin,
      loginAsCustomer,
      loginAsAdmin,
      continueAsGuest,
      logout,
      updateUserAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

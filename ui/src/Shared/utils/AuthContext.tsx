import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuth: (auth: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  const setAuth = (auth: boolean) => setAuthenticated(auth);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

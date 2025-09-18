import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = {
  'admin@skoda.com': {
    id: '1',
    name: 'John Administrator',
    email: 'admin@skoda.com',
    role: 'admin',
    department: 'Fleet Management',
    employeeId: 'EMP001'
  },
  'trainer@skoda.com': {
    id: '2',
    name: 'Sarah Trainer',
    email: 'trainer@skoda.com',
    role: 'trainer',
    department: 'Training Center',
    employeeId: 'EMP002'
  },
  'security@skoda.com': {
    id: '3',
    name: 'Mike Security',
    email: 'security@skoda.com',
    role: 'security',
    department: 'Security',
    employeeId: 'EMP003'
  }
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[credentials.email];
    
    if (user && user.role === credentials.role) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid credentials or incorrect role');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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
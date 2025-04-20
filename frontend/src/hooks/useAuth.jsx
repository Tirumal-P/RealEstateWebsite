import React, { createContext, useContext, useState } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Add a user object based on the token (or null if no token)
  const [user, setUser] = useState(localStorage.getItem('user'));
//   useState(() => {
//     if (token) {
//       try {
//         // Attempt to parse the token (assuming it's a JWT)
//         // This is a simple check - you may need a more robust solution
//         const tokenData = JSON.parse(atob(token.split('.')[1]));
//         return {
//           role: tokenData.role,
//           // Add other user properties you need
//         };
//       } catch (e) {
//         // If token parsing fails, clear it
//         localStorage.removeItem('token');
//         return null;
//       }
//     }
//     return null;
//   });

  // Add loading state for auth checks
  const [loading, setLoading] = useState(false);

  const login = (token,user) => {
    localStorage.setItem('token', token);
    setToken(token);
    localStorage.setItem('user',user);
    setUser(user)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('user',user);
    setToken(null);
    setUser(null);
  };

  // Create the context value object
  const contextValue = {
    token,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
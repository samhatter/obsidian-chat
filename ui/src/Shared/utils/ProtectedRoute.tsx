import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

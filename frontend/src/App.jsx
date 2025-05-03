import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import { useAuth } from "./hooks/useAuth";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/Admin/AdminLogin";

import "bootstrap/dist/css/bootstrap.min.css";

// Lazy load dashboard components to avoid them being rendered unnecessarily
const AdminDashboard = React.lazy(() => import("./components/admin/AdminDashhboard"));
const OwnersPage = React.lazy(() => import("./components/owner/ownerDashboard"));
const CustomerPage = React.lazy(() => import("./components/customerDashboard"));
const RealtorPage = React.lazy(() => import("./components/realtorDashboard"));

function App() {
  // Create a generic protected route component to avoid duplicate evaluation logic
  const ProtectedRoute = ({ userType: requiredUserType, children }) => {
    const { token, user } = useAuth();
    
    // Check if authenticated
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    // Check if user has the correct role
    if (user !== requiredUserType) {
      return <Navigate to="/login" replace />;
    }
    
    // Use Suspense for lazy-loaded components
    return (
      <React.Suspense fallback={<div className="text-center p-5">Loading...</div>}>
        {children}
      </React.Suspense>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<AdminLogin />} />
        </Route>
        
        {/* Admin Dashboard - protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Owner Dashboard - protected */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute userType="owner">
              <OwnersPage />
            </ProtectedRoute>
          }
        />
        
        {/* Customer Dashboard - protected */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute userType="customer">
              <CustomerPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Dashboard - protected */}
        <Route
          path="/realtor/dashboard"
          element={
            <ProtectedRoute userType="realtor">
              <RealtorPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
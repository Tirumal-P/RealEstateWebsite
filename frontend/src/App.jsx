import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import MainLayout from './layouts/MainLayout';
// import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from "./layouts/AuthLayout";
import { useAuth } from "./hooks/useAuth";

// Pages
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
import Login from "./pages/Login/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/Admin/AdminLogin";
// import PropertyListingPage from './pages/PropertyListingPage';
// import PropertyDetailPage from './pages/PropertyDetailPage';
// import ApplicationPage from './pages/ApplicationPage';
// import DashboardPage from './pages/DashboardPage';
// import ContractPage from './pages/ContractPage';
// import NotFound from './pages/NotFound';

import "bootstrap/dist/css/bootstrap.min.css";
import AdminDashboard from "./components/admin/AdminDashhboard";
import OwnersPage from "./components/owner/ownerDashboard";
import CustomerPage from "./components/customerDashboard";
// import './assets/css/styles.css';

function App() {
  const AdminRoute = ({ children }) => {
    const { token: isAuthenticated, user: userType } = useAuth();

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/admin" replace />;
    }

    if (userType !== "admin") {
      // Redirect to home or show unauthorized access
      return <Navigate to="/" replace />;
    }

    return children;
  };

  //owner protected route
  const OwnerRoute = ({ children }) => {
    const { token: isAuthenticated, user: userType } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (userType !== "owner") {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  //Customer protected route
  const CustomerRoute = ({ children }) => {
    const { token: isAuthenticated, user: userType } = useAuth();

    if (!isAuthenticated || userType !== "customer") {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes with MainLayout */}
        {/* <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="properties" element={<PropertyListingPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
        </Route> */}

        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<AdminLogin />} />
        </Route>
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <OwnerRoute>
              <OwnersPage />
            </OwnerRoute>
          }
        />

        {/* Customer Dashboard - protected */}
        <Route
          path="/customer/dashboard"
          element={
            <CustomerRoute>
              <CustomerPage />
            </CustomerRoute>
          }
        />

        {/* Dashboard routes - protected */}
        {/* <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="application/:id" element={<ApplicationPage />} />
          <Route path="contract/:id" element={<ContractPage />} />
        </Route> */}

        {/* 404 route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

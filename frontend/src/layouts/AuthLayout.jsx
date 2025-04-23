import React, { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
// import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context
// import Logo from '../assets/images/logo.png'; // Add your logo path

const AuthLayout = () => {
  // Use your auth context instead of directly checking localStorage
  const { token: isAuthenticated, user: userType } = useAuth();

  if (isAuthenticated) {
    // Check user type and redirect accordingly
    console.log(isAuthenticated);
    console.log(userType);
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/owner/dashboard" />;
  }

  return (
    <div
      className="auth-layout min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {" "}
      {/* Use your theme color */}
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              {/* <img src={Logo} alt="Your Real Estate Logo" height="60" /> */}
            </div>
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Header className="bg-primary text-white text-center py-3">
                <h4 className="mb-0">Welcome to Your Real Estate Portal</h4>
              </Card.Header>
              <Card.Body className="px-4 py-4">
                <Outlet />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;

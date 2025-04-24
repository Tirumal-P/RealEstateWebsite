import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import api from "../../api/axiosInstance";

import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        `/auth/${
          formData.userType
        }/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // For demo purposes - in real app, you'd validate with your backend
      if (response.status == 200) {
        const { token } = response.data;

        // Store the token in localStorage
        login(token, formData.userType, response.data.user._id);

        if (formData.userType === "owner") {
          navigate("/owner/dashboard");
        } else if(formData.userType === "customer") {
          navigate("/customer/dashboard");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="text-center mb-4">
        <h2>Sign In</h2>
        <p className="text-muted">Access your account</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="userType">
          <Form.Label>I am a</Form.Label>
          <Form.Select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="owner">Property Owner</option>
            <option value="realtor">Realtor</option>
          </Form.Select>
        </Form.Group>

        <div className="d-grid">
          <Button
            variant="primary"
            type="submit"
            className="mb-3"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>

        <div className="text-center">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

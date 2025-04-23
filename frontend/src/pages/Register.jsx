import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../api/axiosInstance";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    agreeTerms: false,
    dob: "",
    occupation: "",
    annualIncome: "",
    address: "",
    SSN: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);

  // Check password match whenever password or confirmPassword changes
  useEffect(() => {
    // Only validate if both fields have values

    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For phone field, only allow numbers

    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");

      setFormData((prevState) => ({
        ...prevState,

        [name]: numericValue,
      }));

      return;
    }

    // For annual income field, only allow numbers

    if (name === "annualIncome") {
      const numericValue = value.replace(/[^0-9]/g, "");

      setFormData((prevState) => ({
        ...prevState,

        [name]: numericValue,
      }));

      return;
    }

    // For other fields
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    // Additional validation for required fields

    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "password",
      "dob",
      "address",
      "SSN",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );

        return;
      }
    }

    // Validate SSN format (for US: XXX-XX-XXXX)

    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;

    if (!ssnRegex.test(formData.SSN)) {
      setError("SSN must be in format XXX-XX-XXXX");

      return;
    }

    setLoading(true);

    try {
      // Build API endpoint based on userType
      const endpoint = `/auth/signup/${
        formData.userType
      }`;

      const response = await api.post(endpoint, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dob: formData.dob,
        occupation: formData.occupation,
        annualIncome: formData.annualIncome,
        address: formData.address,
        SSN: formData.SSN
      });

      if (["owner", "realtor"].includes(formData.userType)) {
        alert(
          "Your registration has been submitted. An administrator will review and approve your account."
        );
      } else {
        alert("Registration successful! You can now login.");
      }

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get password feedback styling

  const getPasswordFeedback = () => {
    if (passwordMatch === null) return null;

    if (passwordMatch) {
      return <Form.Text className="text-success">Passwords match! ✓</Form.Text>;
    } else {
      return (
        <Form.Text className="text-danger">Passwords do not match! ✗</Form.Text>
      );
    }
  };

  return (
    <div className="register-page">
      <div className="text-center mb-4">
        <h2>Create Account</h2>
        <p className="text-muted">Join our real estate platform</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
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
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (numbers only)"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="occupation">
              <Form.Label>Occupation</Form.Label>
              <Form.Control
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="annualIncome">
              <Form.Label>Annual Income</Form.Label>
              <Form.Control
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder="Enter annual income (numbers only)"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="SSN">
          <Form.Label>Social Security Number (SSN)</Form.Label>
          <Form.Control
            type="text"
            name="SSN"
            value={formData.SSN}
            onChange={handleChange}
            placeholder="XXX-XX-XXXX"
            required
            pattern="^\d{3}-\d{2}-\d{4}$"
          />
          <Form.Text className="text-muted">Format: XXX-XX-XXXX</Form.Text>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength="8"
                isValid={formData.password.length >= 8}
                isInvalid={formData.password && formData.password.length < 8}
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters long
              </Form.Text>
              {formData.password && formData.password.length < 8 && (
                <Form.Control.Feedback type="invalid">
                  Password too short
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                isValid={passwordMatch === true}
                isInvalid={passwordMatch === false}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4" controlId="userType">
          <Form.Label>I want to register as a</Form.Label>
          <Form.Select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="owner">Property Owner</option>
            <option value="realtor">Realtor</option>
          </Form.Select>
          {["owner", "realtor"].includes(formData.userType) && (
            <Form.Text className="text-muted">
              Note: {formData.userType === "owner" ? "Owner" : "Realtor"}{" "}
              accounts require admin approval
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="agreeTerms">
          <Form.Check
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            label="I agree to the terms and conditions"
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button
            variant="primary"
            type="submit"
            className="mb-3"
            disabled={loading || passwordMatch === false}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>

        <div className="text-center">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Register;

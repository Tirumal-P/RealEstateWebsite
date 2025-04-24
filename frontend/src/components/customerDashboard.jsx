import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axiosInstance";

const CustomerPage = () => {
  const [activeTab, setActiveTab] = useState("browseProperties");
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userId, logout } = useAuth();

  // Fetch properties and applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all available properties
        const propertiesResponse = await api.get("/properties", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch customer's applications
        const applicationsResponse = await api.get(
          `/customer/${userId}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProperties(propertiesResponse.data || []);
        setApplications(applicationsResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token]);

  // State for application form
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    SSN: "",
    employerName: "",
    employementstatus: "employed",
    annualincome: "",
    documents: {
      proofOfEmployment: null,
      governmentId: null,
      proofOfAddress: null,
      bankStatement: null,
    },
  });
  const [documentFiles, setDocumentFiles] = useState({
    proofOfEmployment: null,
    governmentId: null,
    proofOfAddress: null,
    bankStatement: null,
  });

  // Handle opening application form for a property
  const handleOpenApplicationForm = (property) => {
    // Check if application already exists
    const alreadyApplied =
      Array.isArray(applications) &&
      applications.some(
        (app) => app.property && app.property._id === property._id
      );

    if (alreadyApplied) {
      alert("You have already applied for this property!");
      return;
    }

    setSelectedProperty(property);
    setShowApplicationForm(true);
  };

  // Handle application form changes
  const handleApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      // Update the document files state
      setDocumentFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  // Handle sending application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    try {
      if (!selectedProperty) {
        alert("No property selected");
        return;
      }

      // Create FormData object for handling file uploads
      const formData = new FormData();

      // Add application data to FormData
      Object.keys(applicationForm).forEach((key) => {
        if (key !== "documents") {
          formData.append(key, applicationForm[key]);
        }
      });

      // Add propertyId
      formData.append("propertyId", selectedProperty._id);

      // Add document files
      Object.keys(documentFiles).forEach((docType) => {
        if (documentFiles[docType]) {
          formData.append(`documents.${docType}`, documentFiles[docType]);
        }
      });

      const response = await api.post(`/customer/${userId}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Refresh applications list
        const updatedApplications = await api.get(
          `/customer/${userId}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(updatedApplications.data.data || []);
        setShowApplicationForm(false);
        setSelectedProperty(null);
        alert("Application sent successfully!");

        // Reset form
        setApplicationForm({
          fullname: "",
          email: "",
          phonenumber: "",
          SSN: "",
          employerName: "",
          employementstatus: "employed",
          annualincome: "",
          documents: {
            proofOfEmployment: null,
            governmentId: null,
            proofOfAddress: null,
            bankStatement: null,
          },
        });
        setDocumentFiles({
          proofOfEmployment: null,
          governmentId: null,
          proofOfAddress: null,
          bankStatement: null,
        });
      }
    } catch (error) {
      console.error("Error sending application:", error);
      alert(
        `Failed to send application: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Handle property filtering (could be expanded later)
  const filterAvailableProperties = () => {
    return properties.filter((property) => property.status === "available");
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      logout();
      // Redirect is handled by useAuth hook
    }
  };

  return (
    <div className="container-fluid">
      {/* Header with Logout */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1>Customer Dashboard</h1>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs flex-row">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "browseProperties" ? "active" : ""
                }`}
                onClick={() => setActiveTab("browseProperties")}
              >
                Browse Properties
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "myApplications" ? "active" : ""
                }`}
                onClick={() => setActiveTab("myApplications")}
              >
                My Applications
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "contracts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("contracts")}
              >
                Contracts
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {/* Browse Properties Tab */}
        {activeTab === "browseProperties" && (
          <div className="tab-pane active">
            <h2 className="mb-4">Available Properties</h2>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filterAvailableProperties().length > 0 ? (
              <div className="row">
                {filterAvailableProperties().map((property) => (
                  <div key={property._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          className="card-img-top"
                          alt={property.name}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-secondary text-white d-flex justify-content-center align-items-center"
                          style={{ height: "200px" }}
                        >
                          No Image Available
                        </div>
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{property.name}</h5>
                        <p className="card-text">
                          <strong>Type:</strong>{" "}
                          {property.type.charAt(0).toUpperCase() +
                            property.type.slice(1)}
                          <br />
                          {property.bhk && (
                            <>
                              <strong>BHK:</strong> {property.bhk}
                              <br />
                            </>
                          )}
                          {property.area && (
                            <>
                              <strong>Area:</strong> {property.area} sq ft
                              <br />
                            </>
                          )}
                          {property.location && (
                            <>
                              <strong>Location:</strong> {property.location}
                              <br />
                            </>
                          )}
                          <strong>Price:</strong> $
                          {property.price.toLocaleString()}
                        </p>
                        <div className="mt-auto">
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => handleOpenApplicationForm(property)}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                No available properties at the moment. Please check back later.
              </div>
            )}
          </div>
        )}

        {/* Application Form Modal */}
        {showApplicationForm && selectedProperty && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Application for {selectedProperty.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApplicationForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitApplication}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullname"
                          value={applicationForm.fullname}
                          onChange={handleApplicationFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={applicationForm.email}
                          onChange={handleApplicationFormChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phonenumber"
                          value={applicationForm.phonenumber}
                          onChange={handleApplicationFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">SSN</label>
                        <input
                          type="number"
                          className="form-control"
                          name="SSN"
                          value={applicationForm.SSN}
                          onChange={handleApplicationFormChange}
                          placeholder="Last 4 digits only"
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Employer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="employerName"
                          value={applicationForm.employerName}
                          onChange={handleApplicationFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Employment Status</label>
                        <select
                          className="form-select"
                          name="employementstatus"
                          value={applicationForm.employementstatus}
                          onChange={handleApplicationFormChange}
                          required
                        >
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Annual Income ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="annualincome"
                        value={applicationForm.annualincome}
                        onChange={handleApplicationFormChange}
                        required
                      />
                    </div>

                    <h5 className="mt-4 mb-3">Required Documents</h5>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Proof of Employment
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          name="proofOfEmployment"
                          onChange={handleDocumentUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Government ID</label>
                        <input
                          type="file"
                          className="form-control"
                          name="governmentId"
                          onChange={handleDocumentUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Proof of Address</label>
                        <input
                          type="file"
                          className="form-control"
                          name="proofOfAddress"
                          onChange={handleDocumentUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Bank Statement</label>
                        <input
                          type="file"
                          className="form-control"
                          name="bankStatement"
                          onChange={handleDocumentUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowApplicationForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === "myApplications" && (
          <div className="tab-pane active">
            <h2 className="mb-4">My Applications</h2>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application._id}>
                        <td>{application.property.name}</td>
                        <td>
                          {application.property.type.charAt(0).toUpperCase() +
                            application.property.type.slice(1)}
                        </td>
                        <td>{application.property.location}</td>
                        <td>${application.property.price.toLocaleString()}</td>
                        <td>
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              application.status === "approved"
                                ? "bg-success"
                                : application.status === "rejected"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                              // Could show application details modal here
                              alert(
                                `Application Details for ${
                                  application.property.name
                                }\n\nFull Name: ${
                                  application.fullname
                                }\nEmployment Status: ${
                                  application.employementstatus
                                }\nAnnual Income: ${
                                  application.annualincome?.toLocaleString() ||
                                  "Not provided"
                                }`
                              );
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                You haven't applied for any properties yet.
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab (Placeholder for now) */}
        {activeTab === "contracts" && (
          <div className="tab-pane active">
            <h2 className="mb-4">My Contracts</h2>
            <div className="alert alert-info">
              Contract functionality will be available soon. Stay tuned!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";

const OwnersPage = () => {
  const [activeTab, setActiveTab] = useState("uploadProperty");
  const [properties, setProperties] = useState([]);
  const [realtors, setRealtors] = useState([]);
  const [propertyData, setPropertyData] = useState({
    name: "",
    type: "",
    bhk: "",
    area: "",
    price: "",
    location: "",
    realtor: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const { token, userId, logout } = useAuth();

  // Fetch properties and realtors on component mount
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // Mock data fetch
        const properties = await api.get(`/owner/${userId}/properties`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const realtors = await api.get(`/owner/realtors`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(properties);
        console.log(realtors);

        setProperties(properties.data.data);
        setRealtors(realtors.data.data);
        console.log();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
  };

  // Submit property
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object for handling multipart/form-data (for images)
      const formData = new FormData();

      // Add property data to formData
      formData.append("name", propertyData.name);
      formData.append("type", propertyData.type);
      formData.append("bhk", propertyData.bhk);
      formData.append("area", propertyData.area);
      formData.append("price", propertyData.price);
      formData.append("location", propertyData.location);
      formData.append("realtor", propertyData.realtor);

      // Add all image files to formData
      imageFiles.forEach((file, index) => {
        formData.append("images", file);
      });

      // Send POST request to backend
      const response = await api.post(
        `/owner/${userId}/createproperty`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Property created:", response.data);

      // Add the new property to the local state
      if (response.data.success) {
        // Refresh properties by fetching them again
        const propertiesResponse = await api.get(
          `/owner/${userId}/properties`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProperties(
          propertiesResponse.data.data || propertiesResponse.data.properties
        );
      }

      // Reset form
      setPropertyData({
        name: "",
        type: "",
        bhk: "",
        area: "",
        price: "",
        location: "",
        realtor: "",
      });
      setImageFiles([]);

      // Show success message
      alert("Property uploaded successfully!");

      // Switch to My Properties tab
      setActiveTab("myProperties");
    } catch (error) {
      console.error("Error creating property:", error);
      alert(
        `Failed to create property: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // View contract
  const handleViewContract = (property) => {
    // Simulate contract viewing
    console.log("View contract for property:", property);
    alert(`Viewing contract for ${property.name}`);
  };

  // Handle logout

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      // Call logout method from useAuth
      logout();

      // Redirect to admin login page
      navigate("/login");
    }
  };

  return (
    <div className="container-fluid">
      {/* Header with Logout */}

      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1>Property Owner Dashboard</h1>

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
                  activeTab === "uploadProperty" ? "active" : ""
                }`}
                onClick={() => setActiveTab("uploadProperty")}
              >
                Upload Property
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "myProperties" ? "active" : ""
                }`}
                onClick={() => setActiveTab("myProperties")}
              >
                My Properties
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {/* Upload Property Tab */}
        {activeTab === "uploadProperty" && (
          <div className="tab-pane active">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <h2 className="mb-4 text-center">Upload New Property</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Property Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="name"
                      value={propertyData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Property Type</label>
                    <select
                      className="form-select form-select-sm"
                      name="type"
                      value={propertyData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Property Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">BHK</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="bhk"
                        value={propertyData.bhk}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Area (sq ft)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="area"
                        value={propertyData.area}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="price"
                        value={propertyData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="location"
                        value={propertyData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Realtor</label>
                    <select
                      className="form-select form-select-sm"
                      name="realtor"
                      value={propertyData.realtor}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Realtor</option>
                      {realtors.map((realtor) => (
                        <option key={realtor._id} value={realtor._id}>
                          {realtor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Images</label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    {imageFiles.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="position-relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Upload Property
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* My Properties Tab */}
        {activeTab === "myProperties" && (
          <div className="tab-pane active">
            <h2 className="mb-4">My Properties</h2>
            {properties && properties.length != 0 ? (
              <div className="row">
                {properties.map((property) => (
                  <div key={property._id} className="col-md-4 mb-4">
                    <div className="card">
                      {property.images && property.images.length > 0 && (
                        <img
                          src={property.images[0]}
                          className="card-img-top"
                          alt={property.name}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{property.name}</h5>
                        <p className="card-text">
                          Type: {property.type}
                          <br />
                          Location: {property.location}
                          <br />
                          Price: ${property.price.toLocaleString()}
                          <br />
                          Status: {property.status}
                        </p>
                        {property.realtor && (
                          <p className="card-text">
                            Realtor: {property.realtor.name}
                          </p>
                        )}
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleViewContract(property)}
                        >
                          View Contract
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No properties associated for you</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnersPage;

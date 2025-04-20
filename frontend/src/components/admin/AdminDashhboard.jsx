import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaUserTie,
  FaFileContract,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt, // Ensure this is explicitly added
} from "react-icons/fa";
import LoadingSpinner from "../../common/LoadingSpinner";
import Alert from "../../common/Alert";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOwners: 0,
    // totalProperties: 0,
    totalRealtors: 0,
    // totalContracts: 0,
    pendingApprovals: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [pendingRealtors, setPendingRealtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  console.log(token);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch statistics
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // const statsResponse = await fetch('/api/admin/stats');
        console.log();
        if (!statsResponse.status==200) {
          throw new Error("Failed to fetch statistics");
        }
        const statsData = await statsResponse.data;
        setStats(statsData);

        // Fetch recent users
        // const usersResponse = await fetch('/api/admin/users/recent');
        // if (!usersResponse.ok) {
        //   throw new Error('Failed to fetch recent users');
        // }
        // const usersData = await usersResponse.json();
        // setRecentUsers(usersData);

        // Fetch pending owners
        const ownersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/owners/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // const ownersResponse = await fetch('/api/admin/owners/pending');
        if (!ownersResponse.status==200) {
          throw new Error("Failed to fetch pending owners");
        }
        const ownersData = await ownersResponse.data;
        setPendingOwners(ownersData);

        // Fetch pending realtors
        const realtorsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/realtors/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // const realtorsResponse = await fetch('/api/admin/realtors/pending');
        if (!realtorsResponse.status==200) {
          throw new Error("Failed to fetch pending realtors");
        }
        const realtorsData = await realtorsResponse.data;
        setPendingRealtors(realtorsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      try {
        // Call logout method from useAuth
        logout();

        // Redirect to admin login page
        navigate("/admin");
      } catch (err) {
        // Handle any logout errors
        setError("Failed to log out. Please try again.");
      }
    }
  };

  const handleApproveUser = async (userId, userType) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      // Update the pending lists
      if (userType === "owner") {
        setPendingOwners(pendingOwners.filter((owner) => owner._id !== userId));
      } else if (userType === "realtor") {
        setPendingRealtors(
          pendingRealtors.filter((realtor) => realtor._id !== userId)
        );
      }

      // Update stats
      setStats({
        ...stats,
        pendingApprovals: stats.pendingApprovals - 1,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectUser = async (userId, userType) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject user");
      }

      // Update the pending lists
      if (userType === "owner") {
        setPendingOwners(pendingOwners.filter((owner) => owner._id !== userId));
      } else if (userType === "realtor") {
        setPendingRealtors(
          pendingRealtors.filter((realtor) => realtor._id !== userId)
        );
      }

      // Update stats
      setStats({
        ...stats,
        pendingApprovals: stats.pendingApprovals - 1,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid px-4 py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>

      {error && <Alert type="danger" message={error} />}

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Owners</h5>
                  <h2 className="mb-0">{stats.totalOwners}</h2>
                </div>
                <FaUser size={32} />
              </div>
            </div>
            {/* <div className="card-footer d-flex align-items-center justify-content-between">
              <Link
                to="/admin/users"
                className="small text-white stretched-link"
              >
                View Details
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Properties</h5>
                  <h2 className="mb-0">{stats.totalProperties}</h2>
                </div>
                <FaHome size={32} />
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/properties" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div> */}

        <div className="col-xl-3 col-md-6">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Realtors</h5>
                  <h2 className="mb-0">{stats.totalRealtors}</h2>
                </div>
                <FaUserTie size={32} />
              </div>
            </div>
            {/* <div className="card-footer d-flex align-items-center justify-content-between">
              <Link
                to="/admin/realtors"
                className="small text-white stretched-link"
              >
                View Details
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Contracts</h5>
                  <h2 className="mb-0">{stats.totalContracts}</h2>
                </div>
                <FaFileContract size={32} />
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/contracts" className="small text-white stretched-link">View Details</Link>
              <div className="small text-white"><i className="fas fa-angle-right"></i></div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Pending Approvals */}
      <div className="card mb-4">
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">Pending Approvals ({stats.pendingApprovals})</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Pending Owners */}
            <div className="col-md-6">
              <h5>Pending Owners</h5>
              {pendingOwners.length === 0 ? (
                <p className="text-muted">No pending owner approvals</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOwners.map((owner) => (
                        <tr key={owner._id}>
                          <td>{owner.firstname + " " + owner.lastname}</td>
                          <td>{owner.email}</td>
                          <td>
                            {new Date(owner.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  handleApproveUser(owner._id, "owner")
                                }
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleRejectUser(owner._id, "owner")
                                }
                              >
                                <FaTimesCircle />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pending Realtors */}
            <div className="col-md-6">
              <h5>Pending Realtors</h5>
              {pendingRealtors.length === 0 ? (
                <p className="text-muted">No pending realtor approvals</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRealtors.map((realtor) => (
                        <tr key={realtor._id}>
                          <td>{realtor.name}</td>
                          <td>{realtor.email}</td>
                          <td>
                            {new Date(realtor.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  handleApproveUser(realtor._id, "realtor")
                                }
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleRejectUser(realtor._id, "realtor")
                                }
                              >
                                <FaTimesCircle />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      {/* <div className="card">
        <div className="card-header">
          <h4 className="mb-0">Recent Users</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <Link to={`/admin/users/${user._id}`}>
                        {user.fullName}
                      </Link>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "bg-dark"
                            : user.role === "owner"
                            ? "bg-primary"
                            : user.role === "realtor"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.isVerified ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-3">
            <Link to="/admin/users" className="btn btn-outline-primary">
              View All Users
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminDashboard;

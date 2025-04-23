import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import Alert from '../../common/Alert'; // Assuming Alert is in the same directory

const AdminLogin = () => {
  const [adminId, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Make sure to replace with your actual API base URL
      const response = await api.post(`/auth/admin/login`, {
        adminId,
        password
      });

      // Assuming the backend returns a token or user info
      const { token } = response.data;

      // Store the token in localStorage
      login(token, 'admin')

      // Redirect to admin dashboard or home page
      window.location.href = '/admin/dashboard';

    } catch (err) {
      // Handle login errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Login failed. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log(err);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Admin Login</h2>
              
              {error && <Alert type="danger" message={error} />}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="adminId" className="form-label">adminId</label>
                  <input
                    type="text"
                    className="form-control"
                    id="adminId"
                    placeholder="Enter adminId"
                    value={adminId}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
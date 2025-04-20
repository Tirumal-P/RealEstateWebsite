import React from 'react';

const Alert = ({ 
  type = 'danger', 
  message, 
  className = '' 
}) => {
  // Mapping alert types to Bootstrap classes
  const alertClasses = {
    info: 'alert-info',
    success: 'alert-success', 
    warning: 'alert-warning',
    danger: 'alert-danger',
    primary: 'alert-primary',
    secondary: 'alert-secondary'
  };

  // Determine the alert class, default to danger if not found
  const alertClass = alertClasses[type] || 'alert-danger';

  // If no message, return null
  if (!message) return null;

  return (
    <div 
      className={`alert ${alertClass} ${className}`} 
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
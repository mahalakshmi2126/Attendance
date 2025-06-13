import React from 'react';

const EmployeeDetailsModal = ({ data, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-xl text-white relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Employee Details</h2>

        <div className="space-y-2">
          <div><strong>Full Name:</strong> {data.fullName}</div>
          <div><strong>Mail ID:</strong> {data.mailID}</div>
          <div><strong>Username:</strong> {data.username}</div>
          <div><strong>Password:</strong> {data.password}</div>
          <div><strong>Mobile:</strong> {data.mobile}</div>
          <div><strong>Role:</strong> {data.role}</div>
          <div><strong>Mobile MAC Address:</strong> {data.mobileMacAddress || '—'}</div>
          <div><strong>Laptop MAC Address:</strong> {data.laptopMacAddress || '—'}</div>
        </div>

        <button className="absolute top-2 right-4 text-white text-lg" onClick={closeModal}>×</button>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
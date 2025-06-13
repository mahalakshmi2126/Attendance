import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const EmployeeFormModal = ({ closeModal, fetchEmployees, editEmployee }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mailID: '',
    mobile: '',
    username: '',
    password: '',
    mobileMacAddress: '',
    laptopMacAddress: '',
    role: 'employee',
  });

  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (editEmployee) {
      setFormData({
        fullName: editEmployee.fullName || '',
        mailID: editEmployee.mailID || '',
        mobile: editEmployee.mobile || '',
        username: editEmployee.username || '',
        password: editEmployee.password || '',
        mobileMacAddress: editEmployee.mobileMacAddress || '',
        laptopMacAddress: editEmployee.laptopMacAddress || '',
        role: editEmployee.role || 'employee',
      });
    }
  }, [editEmployee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'mailID', 'mobile', 'username'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    if (!editEmployee && !formData.password) {
      toast.error('Password is required.');
      return;
    }

    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (
      (formData.mobileMacAddress && !macRegex.test(formData.mobileMacAddress)) ||
      (formData.laptopMacAddress && !macRegex.test(formData.laptopMacAddress))
    ) {
      toast.error('Invalid MAC address format.');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editEmployee) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await axios.put(`http://localhost:5000/api/employee/update/${editEmployee._id}`, updateData, config);
        toast.success('Employee updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/employee/create', formData, config);
        toast.success('Employee created successfully');
      }

      fetchEmployees();
      closeModal();
    } catch (err) {
      toast.error('Failed to submit form');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 w-full max-w-xl text-white relative mx-4">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editEmployee ? 'Edit' : 'New'} Employee
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="mailID">Email Address *</label>
            <input
              id="mailID"
              name="mailID"
              value={formData.mailID}
              onChange={handleChange}
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="role">Role</label>
            <input
              id="role"
              name="role"
              value="employee"
              readOnly
              className="p-2 rounded bg-white bg-opacity-30 text-white"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="relative flex flex-col">
            <label htmlFor="password">Password {editEmployee ? '' : '*'}</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 pr-10 rounded bg-white bg-opacity-30 text-white"
              required={!editEmployee}
            />
            <span
              className="absolute right-3 top-9 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="mobileMacAddress">Mobile MAC Address</label>
            <input
              id="mobileMacAddress"
              name="mobileMacAddress"
              value={formData.mobileMacAddress}
              onChange={handleChange}
              placeholder="e.g. 00:1A:2B:3C:4D:5E"
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="laptopMacAddress">Laptop MAC Address</label>
            <input
              id="laptopMacAddress"
              name="laptopMacAddress"
              value={formData.laptopMacAddress}
              onChange={handleChange}
              placeholder="e.g. 00:1A:2B:3C:4D:5E"
              className="p-2 rounded bg-white bg-opacity-30 text-white"
              required
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-center mt-4">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
              {editEmployee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>

        <button className="absolute top-2 right-4 text-white text-lg" onClick={closeModal}>
          ×
        </button>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
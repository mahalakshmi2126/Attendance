import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash, UserRound } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmployeeDetailsModal from './EmployeeDetailsModal';
import EmployeeFormModal from './EmployeeFormModal';
import AdminEmployeeAttendanceModal from './AdminEmployeeAttendanceModal';


const EmployeeViewModal = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [attendanceEmployee, setAttendanceEmployee] = useState(null);


  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employee/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/employee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee deleted');
      fetchEmployees();
    } catch (err) {
      toast.error('Error deleting employee');
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employee/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedEmployee(res.data);
      setShowDetails(true);
    } catch {
      toast.error('Failed to fetch employee details');
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employee/list/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditEmployee(res.data);
      setShowForm(true);
    } catch {
      toast.error('Failed to fetch employee for editing');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAttendanceView = (emp) => {
    setAttendanceEmployee(emp);
    setShowAttendanceView(true);
  };


  return (
    <div className="space-y-4">

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 w-full sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full max-w-[180px] sm:max-w-[256px] px-4 py-2 rounded bg-white/20 placeholder-white text-white border border-white/20 focus:outline-none"
        />
        <button
          onClick={() => {
            setEditEmployee(null);
            setShowForm(true);
          }}
          className="px-4 py-2 rounded bg-green-600 text-white font-medium w-24 sm:w-auto"
        >
          + Create
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-md text-white overflow-x-auto">
        <table className="min-w-[1000px] w-full table-auto border border-gray-400 text-sm">
          <thead className="bg-blue-200 text-black">
            <tr>
              {[
                'S.No',
                'Full Name',
                'Mail ID',
                'Mobile',
                'Username',
                'Password',
                'Mobile MAC',
                'Laptop MAC',
                'Role',
                'Actions',
              ].map((header) => (
                <th key={header} className="px-3 py-2 border whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-black/20 text-white">
            {filteredEmployees.map((emp, index) => (
              <tr key={emp._id} className="text-center">
                <td className="px-3 py-2 border">{index + 1}</td>
                <td className="px-3 py-2 border">{emp.fullName}</td>
                <td className="px-3 py-2 border">{emp.mailID}</td>
                <td className="px-3 py-2 border">{emp.mobile}</td>
                <td className="px-3 py-2 border">{emp.username}</td>
                <td className="px-3 py-2 border">{emp.password}</td>
                <td className="px-3 py-2 border">{emp.mobileMacAddress || '—'}</td>
                <td className="px-3 py-2 border">{emp.laptopMacAddress || '—'}</td>
                <td className="px-3 py-2 border">{emp.role}</td>
                <td className="px-3 py-2 border">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(emp._id)}
                      className="bg-green-500 p-1 rounded"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(emp._id)}
                      className="bg-blue-500 p-1 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="bg-red-500 p-1 rounded"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      onClick={() => handleAttendanceView(emp)}
                      className="bg-yellow-500 p-1 rounded"
                      title="View Attendance"
                    >
                      <UserRound size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Modals */}
      {showDetails && selectedEmployee && (
        <EmployeeDetailsModal
          data={selectedEmployee}
          closeModal={() => setShowDetails(false)}
        />
      )}

      {showForm && (
        <EmployeeFormModal
          closeModal={() => setShowForm(false)}
          fetchEmployees={fetchEmployees}
          editEmployee={editEmployee}
        />
      )}

      {showAttendanceView && attendanceEmployee && (
  <AdminEmployeeAttendanceModal
    employee={attendanceEmployee}
    onClose={() => setShowAttendanceView(false)}
  />
)}

    </div>
  );
};

export default EmployeeViewModal;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, X, User, LogOut } from 'lucide-react';
import { FaUserCircle, FaTimes, FaBars, FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import OfficeMacManager from './OfficeMacManager';


const SuperadminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [deletedAdmins, setDeletedAdmins] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedAdmin, setSelectedAdmin] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
  fullName: '',
  mailID: '',
  mobile: '',
  username: '',
  password: '',
  brandName: '',
  location: '',
  role: ''
});

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/list-admins', { headers });
      setAdmins(res.data);
    } catch (error) {
      toast.error('Error fetching admins');
    }
  };

  const fetchDeletedAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/deleted-admin', { headers });
      setDeletedAdmins(res.data);
    } catch (error) {
      toast.error('Error fetching deleted admins');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/delete-admin/${id}`, {}, { headers });
      toast.success('Admin deleted');
      fetchAdmins();
    } catch (error) {
      toast.error('Error deleting admin');
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/restore-admin/${id}`, {}, { headers });
      toast.success('Admin restored');
      fetchDeletedAdmins();
    } catch (error) {
      toast.error('Error restoring admin');
    }
  };

  const handleEditClick = (admin) => {
  setSelectedAdmin(admin);
  setShowEditModal(true);
};

const handleViewClick = (admin) => {
  setSelectedAdmin(admin);
  setShowViewModal(true);
};

const handleUpdateAdmin = async () => {
  try {
    await axios.put(`http://localhost:5000/api/update-admin/${selectedAdmin._id}`, selectedAdmin, { headers });
    toast.success('Admin updated');
    setShowEditModal(false);
    fetchAdmins();
  } catch (error) {
    toast.error('Update failed');
  }
};

const handleEditInputChange = (e) => {
  setSelectedAdmin({ ...selectedAdmin, [e.target.name]: e.target.value });
};



  const handleProfileClick = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(res.data.profile);
      console.log(res.data);
      toast.success('Profile loaded successfully');
      setShowProfileModal(true);
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    }
  };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/login', { state: { fromLogout: true } });
      };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleCreateAdmin = async () => {
  const { fullName, mailID, mobile, username, password, brandName, location, role } = formData;

  if (!fullName || !mailID || !mobile || !username || !password || !brandName || !location || !role) {
    toast.error('Please fill all fields');
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/create-admin', formData, { headers });
    toast.success('Admin created successfully');
    setShowCreateModal(false);
    setFormData({
      fullName: '',
      mailID: '',
      mobile: '',
      username: '',
      password: '',
      brandName: '',
      location: '',
      role: ''
    });
    fetchAdmins();
  } catch (error) {
    toast.error('Failed to create admin');
  }
};


  useEffect(() => {
    fetchAdmins();
    fetchDeletedAdmins();
  }, []);

   const filteredAdmins = (showDeleted ? deletedAdmins : admins).filter(admin =>
    Object.values(admin).some(value => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white p-4">
 <div className="bg-white/20 rounded-xl px-6 py-4 flex justify-between items-center mb-6 shadow-md backdrop-blur-md">
        {/* Logo + Heading */}
        <div className="flex items-center gap-3">
            <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-white">Attendance Management</h2>
            <p className="text-sm text-white/80">Admin Control Panel</p>
          </div>
        </div>

        {/* Client / Deleted Tabs - hidden on small screens */}
        <div className="hidden md:flex items-center justify-center bg-white/80 rounded-full px-2 py-1">
          <button
            onClick={() => setShowDeleted(false)}
            className={`flex items-center px-4 py-1 rounded-full transition-all duration-200 ${
              !showDeleted ? 'bg-lime-400 text-black font-semibold' : 'text-gray-500'
            }`}
          >
            {!showDeleted && <span className="mr-1 text-xl">•</span>} Clients
          </button>
          <button
            onClick={() => setShowDeleted(true)}
            className={`flex items-center px-4 py-1 rounded-full transition-all duration-200 ${
              showDeleted ? 'bg-lime-400 text-black font-semibold' : 'text-gray-500'
            }`}
          >
            {showDeleted && <span className="mr-1 text-xl">•</span>} Deleted Clients
          </button>
        </div>

        {/* Profile Icon / Menu Button */}
        <div className="relative">
          {/* Desktop: Profile */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-white rounded-full"
          >
            <FaUserCircle size={24} className="text-green-400" />
            <div className="text-left">
              <p className="text-sm mb-2 font-bold leading-4">CorpWings</p>
              <p className="text-[10px] leading-3">SUPERADMIN</p>
            </div>
          </button>

          {/* Mobile: Menu Toggle */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden text-xl"
          >
            <FaBars size={20} />
            <span className="text-sm font-semibold"></span>
          </button>

          {/* Dropdown - Desktop */}
          {showMenu && (
  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-black z-50 hidden md:block">
    <button
      onClick={() => {
        handleProfileClick();
        setShowMenu(false);
      }}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
    >
      <User size={16} /> Profile
    </button>
    <button
      onClick={() => {
        handleLogout();
        setShowMenu(false);
      }}
      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
    >
      <LogOut size={16} /> Logout
    </button>
  </div>
)}
        </div>
      </div>

      {/* Mobile Dropdown Sidebar Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end md:hidden">
          <div className="bg-gradient-to-b from-gray-900 to-gray-700 w-[80%] h-96 p-4 rounded-l-xl shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                  <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
                <h2 className="text-lg font-semibold text-white mt-2">Attendance Management</h2>
                <p className="text-xs text-gray-300">Admin Control Panel</p>
              </div>
              <button onClick={() => setShowMenu(false)}>
                <FaTimes size={24} className="text-white" />
              </button>
            </div>

           {/* Mobile Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowDeleted(false);
                  setShowMenu(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  !showDeleted ? 'bg-lime-400 text-black font-semibold' : 'bg-white/10 text-white'
                }`}
              >
                {!showDeleted && <span className="text-xl">•</span>} Clients
              </button>
              <button
                onClick={() => {
                  setShowDeleted(true);
                  setShowMenu(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  showDeleted ? 'bg-lime-400 text-black font-semibold' : 'bg-white/10 text-white'
                }`}
              >
                {showDeleted && <span className="text-xl">•</span>} Deleted Clients
              </button>
            </div>


            {/* Footer */}
            <div className="mt-12 space-y-3">
              <div className="flex gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex-1 bg-white/20 text-white text-sm py-2 rounded-lg border border-white/10"
              >
                Profile
              </button>
            </div>
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-lime-400" size={32} />
                <div className="flex-1 text-white">
                  <p className="text-sm font-bold leading-5">CorpWings</p>
                  <p className="text-xs text-gray-300">SUPERADMIN</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="bg-white text-black text-sm px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <FaTimes size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


 <div className="flex items-center gap-4 mb-4 w-full flex-wrap">
  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="bg-white/20 px-4 py-2 rounded-md w-64 text-white placeholder-white/70 outline-none"
  />

  <OfficeMacManager />

  {/* Create button only if NOT in deleted tab */}
  {!showDeleted && (
    <button
      className="ml-auto bg-green-600 px-4 py-2 rounded text-white"
      onClick={() => setShowCreateModal(true)}
    >
      Create
    </button>
  )}
</div>

      <div className="overflow-x-auto p-6 bg-white/20 rounded-xl shadow-lg">
        <table className="w-full text-sm text-left bg-black/20 text-black rounded-xl">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="p-2">Full Name</th>
              <th className="p-2">Mail ID</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Username</th>
              <th className="p-2">Password</th>
              <th className="p-2">Brand Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((admin) => (
              <tr key={admin._id} className="border text-white hover:bg-white/10 hover:text-white">
                <td className="p-2">{admin.fullName}</td>
                <td className="p-2">{admin.mailID}</td>
                <td className="p-2">{admin.mobile}</td>
                <td className="p-2">{admin.username}</td>
                <td className="p-2">{admin.password}</td>
                <td className="p-2">{admin.brandName}</td>
                <td className="p-2">{admin.location}</td>
                <td className="p-2">{admin.role}</td>
                <td className="p-2 flex gap-2">


                  <button className="text-green-600 border bg-white p-1" onClick={() => handleViewClick(admin)}><Eye size={16} /></button>
                  {!showDeleted && (
                    <>
                      <button className="text-blue-500 border bg-white p-1" onClick={() => handleEditClick(admin)}><Edit size={16} /></button>
                      <button className="text-red-500 border bg-white p-1" onClick={() => handleDelete(admin._id)}><Trash2 size={16} /></button>
                    </>
                  )}
                  {showDeleted && (
                    <button className="text-green-600 border bg-white p-1" onClick={() => handleRestore(admin._id)}>♻️</button>
                  )}
                </td>
              </tr>
            ))}
            {currentAdmins.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-4 text-white">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

            <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence>
         {showProfileModal && profileData && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="relative bg-white/30 text-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 max-h-screen overflow-y-auto">
      
      {/* Close Button */}
      <button
        onClick={() => setShowProfileModal(false)}
        className="absolute top-3 right-4 text-white hover:text-red-500 text-xl"
        aria-label="Close"
      >
        <FaTimes />
      </button>

      {/* Left: Avatar */}
      <div className="flex flex-col items-center sm:w-1/2">
        <div className="rounded-full w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-6xl text-black shadow-md">
          <FaUserCircle size={130} className="text-lime-400" />
        </div>
      </div>

      {/* Right: Profile Info */}
      <div className="text-sm sm:text-base sm:w-1/2 space-y-2">
        <p><strong>Full Name:</strong> {profileData.name}</p>
        <p><strong>Username:</strong> {profileData.officeId}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Role:</strong> {profileData.role}</p>
      </div>
    </div>
  </div>
)}

       {showCreateModal && (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white/20 p-6 sm:p-8 rounded-xl w-full max-w-3xl text-white backdrop-blur-lg relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    >
      <button
        className="absolute top-3 right-4 text-white"
        onClick={() => setShowCreateModal(false)}
      >
        <X />
      </button>
      <h2 className="text-center text-2xl font-bold mb-6">New Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'fullName', label: 'Full Name' },
          { name: 'mailID', label: 'Email ID' },
          { name: 'mobile', label: 'Mobile' },
          { name: 'username', label: 'Username' },
          { name: 'password', label: 'Password' },
          { name: 'brandName', label: 'Brand Name' },
          { name: 'location', label: 'Location' },
        ].map(({ name, label }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 text-sm font-medium">{label}</label>
            <input
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              className="px-3 py-2 rounded bg-white/30 text-white placeholder-white/70 outline-none"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}

        <div className="flex flex-col">
  <label className="mb-1 text-sm font-medium">Role</label>
  <select
    name="role"
    value="admin"
    disabled
    className="px-3 py-2 rounded bg-white/30 text-white opacity-60 cursor-not-allowed"
  >
    <option value="admin">Admin</option>
  </select>
</div>
      </div>

      <button
        className="mt-6 bg-green-600 px-4 py-2 rounded text-white w-full sm:w-auto block mx-auto"
        onClick={handleCreateAdmin}
      >
        Submit
      </button>
    </motion.div>
  </motion.div>
)}


        {showEditModal && selectedAdmin && (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white/20 p-6 sm:p-8 rounded-xl w-full max-w-3xl text-white backdrop-blur-lg relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    >
      <button
        className="absolute top-3 right-4 text-white"
        onClick={() => setShowEditModal(false)}
      >
        <X />
      </button>
      <h2 className="text-center text-2xl font-bold mb-6">Edit Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'fullName', label: 'Full Name' },
          { name: 'mailID', label: 'Mail ID' },
          { name: 'mobile', label: 'Mobile' },
          { name: 'username', label: 'Username' },
          { name: 'password', label: 'Password' },
          { name: 'brandName', label: 'Brand Name' },
          { name: 'location', label: 'Location' },
        ].map(({ name, label }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 text-sm font-medium">{label}</label>
            <input
              name={name}
              value={selectedAdmin[name]}
              onChange={handleEditInputChange}
              className="px-3 py-2 rounded bg-white/30 text-white placeholder-white/70 outline-none"
              placeholder={`Enter ${label}`}
            />
          </div>
        ))}

        <div className="flex flex-col">
  <label className="mb-1 text-sm font-medium">Role</label>
  <select
    name="role"
    value="admin"
    disabled
    className="px-3 py-2 rounded bg-white/30 text-white opacity-60 cursor-not-allowed"
  >
    <option value="admin">Admin</option>
  </select>
</div>

      </div>

      <button
        className="mt-6 bg-green-600 px-4 py-2 rounded text-white w-full sm:w-auto block mx-auto"
        onClick={handleUpdateAdmin}
      >
        Update
      </button>
    </motion.div>
  </motion.div>
)}


  {showViewModal && selectedAdmin && (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white/20 p-6 sm:p-8 rounded-xl w-full max-w-2xl text-white backdrop-blur-lg relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    >
      <button
        className="absolute top-3 right-4 text-white"
        onClick={() => setShowViewModal(false)}
      >
        <X />
      </button>
      <h2 className="text-center text-2xl font-bold mb-6">View Admin</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'fullName', label: 'Full Name' },
          { name: 'mailID', label: 'Mail ID' },
          { name: 'mobile', label: 'Mobile' },
          { name: 'username', label: 'Username' },
          { name: 'password', label: 'Password' },
          { name: 'brandName', label: 'Brand Name' },
          { name: 'location', label: 'Location' },
          { name: 'role', label: 'Role' },
        ].map(({ name, label }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-white/90">{label}</label>
            <div className="px-3 py-2 rounded bg-white/20 text-white break-words">
              {selectedAdmin[name]}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
)}


      </AnimatePresence>
    </div>
  );
};

export default SuperadminDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OfficeMacManager = () => {
  const [macAddress, setMacAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [inputMac, setInputMac] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchMac = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/get/office-mac', { headers });
        setMacAddress(res.data.macAddress || '');
      } catch (err) {
        toast.error('Failed to load MAC address');
      }
    };
    fetchMac();
  }, []);

  const handleEditClick = () => {
    setInputMac(macAddress);
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    if (!inputMac.trim()) {
      toast.error('MAC address cannot be empty');
      return;
    }

    try {
      if (macAddress) {
        await axios.put(
          'http://localhost:5000/api/update/office-mac',
          { macAddress: inputMac.trim() },
          { headers }
        );
        toast.success('MAC address updated');
      } else {
        await axios.post(
          'http://localhost:5000/api/create/office-mac',
          { macAddress: inputMac.trim() },
          { headers }
        );
        toast.success('MAC address saved');
      }

      setMacAddress(inputMac.trim());
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save MAC address');
    }
  };

  return (
 <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
    <label className="font-semibold text-white whitespace-nowrap">Wifi MAC Address:</label>

    {!editMode ? (
      <span className="font-mono break-all px-3 py-1 rounded bg-white/20 text-white">
        {macAddress || 'No MAC address set'}
      </span>
    ) : (
      <input
        type="text"
        value={inputMac}
        onChange={(e) => setInputMac(e.target.value)}
        className="rounded px-2 py-1 text-white bg-white/20 placeholder-white"
        placeholder="Enter MAC address"
        spellCheck={false}
      />
    )}

    <div className="flex gap-2 flex-wrap">
      {!editMode ? (
        <button
          onClick={handleEditClick}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
        >
          {macAddress ? 'Edit' : 'Add'}
        </button>
      ) : (
        <>
          <button
            onClick={handleSaveClick}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
          >
            Save
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  </div>
  );
};

export default OfficeMacManager;
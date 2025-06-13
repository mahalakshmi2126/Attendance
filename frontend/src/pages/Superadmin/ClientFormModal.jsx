import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ClientFormModal = ({ isOpen, onClose, client, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
    } else {
      setName("");
      setEmail("");
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (client) {
        await axios.put(`http://localhost:5000/api/admin/update/${client._id}`, { name, email });
        toast.success("Client updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/admin/create", { name, email });
        toast.success("Client created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to save client");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {client ? "Edit Client" : "Create Client"}
          </h2>
          <X className="cursor-pointer text-gray-600 dark:text-white" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full mb-4 px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            {client ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
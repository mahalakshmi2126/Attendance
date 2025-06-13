// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { RotateCcw } from "lucide-react";

// const TrashClients = ({ fetchClients }) => {
//   const [deletedClients, setDeletedClients] = useState([]);

//   const fetchDeletedClients = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/admin/deleted");
//       setDeletedClients(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch deleted clients");
//     }
//   };

//   const handleRestore = async (id) => {
//     try {
//       await axios.put(`http://localhost:5000/api/admin/restore/${id}`);
//       toast.success("Client restored successfully");
//       fetchDeletedClients();
//       fetchClients();
//     } catch (error) {
//       toast.error("Failed to restore client");
//     }
//   }; }

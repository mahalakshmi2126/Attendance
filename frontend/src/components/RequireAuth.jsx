// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// export default function RequireAuth({ role }) {
//   const user = JSON.parse(sessionStorage.getItem("user"));

//   if (!user || user.role !== role.toLowerCase()) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }
// import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/login";
// import RequireAuth from "./components/RequireAuth";
// import SuperadminRoutesWrapper from "./routes/SuperadminRoutesWrapper";
// import AdminRoutesWrapper from "./routes/AdminRoutesWrapper";
// import EmployeeRoutesWrapper from "./routes/EmployeeRoutesWrapper";

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const sessionUser = JSON.parse(sessionStorage.getItem("user"));
//     setUser(sessionUser);
//   }, []);

//   if (user === null) return <div>Loading...</div>;

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />

//         <Route element={<RequireAuth role="superadmin" />}>
//           <Route path="/dashboard/superadmin/*" element={<SuperadminRoutesWrapper />} />
//         </Route>

//         <Route element={<RequireAuth role="admin" />}>
//           <Route path="/dashboard/admin/*" element={<AdminRoutesWrapper />} />
//         </Route>

//         <Route element={<RequireAuth role="employee" />}>
//           <Route path="/dashboard/employee/*" element={<EmployeeRoutesWrapper />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


// Basic structure of a role-based React frontend

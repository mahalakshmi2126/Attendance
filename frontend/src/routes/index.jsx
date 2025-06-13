// import React, { useEffect, useState } from 'react';
// import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// import { AdminRoutes } from './AdminRoutesWrapper';
// import { SuperadminRoutes } from './SuperadminRoutesWrapper';
// import { EmployeeRoutes } from './EmployeeRoutesWrapper';
// import Mains from '../mains';
// import LoginPage from '../pages/login';
// import { fetchProfile } from '../utils/api';

// const Routers = () => {
//   // Read role from localStorage on initial load
//   const [role, setRole] = useState(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       return user?.role?.toLowerCase() || null;
//     } catch {
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem('access-token');
//   const location = useLocation();

//   useEffect(() => {
//     const getUserRole = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const profile = await fetchProfile();
//         if (profile?.role) {
//           const normalized = profile.role.toLowerCase();
//           setRole(normalized);

//           // Ensure role in localStorage matches
//           const user = JSON.parse(localStorage.getItem('user') || '{}');
//           if (!user.role || user.role.toLowerCase() !== normalized) {
//             localStorage.setItem(
//               'user',
//               JSON.stringify({
//                 ...user,
//                 role: normalized,
//               })
//             );
//           }
//         }
//       } catch (err) {
//         console.error('Failed to fetch profile:', err);
//         localStorage.removeItem('access-token');
//         localStorage.removeItem('user');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getUserRole();
//   }, [token]);

//   const selectRouteByRole = () => {
//     switch (role) {
//       case 'superadmin':
//         return SuperadminRoutes;
//       case 'admin':
//         return AdminRoutes;
//       case 'employee':
//         return EmployeeRoutes;
//       default:
//         return [];
//     }
//   };

//   const isAuthenticated = token && role;

//   const routes = loading
//     ? [
//         {
//           path: '*',
//           element: <div className="text-center p-4">Loading...</div>,
//         },
//       ]
//     : [
//         {
//           path: '/',
//           element: isAuthenticated ? <Mains /> : <Navigate to="/login" replace />,
//           children: isAuthenticated ? selectRouteByRole() : [],
//         },
//         {
//           path: '/login',
//           element: <LoginPage />,
//         },
//         {
//           path: '*',
//           element: <Navigate to={isAuthenticated ? '/' : '/login'} replace />,
//         },
//       ];

//   const element = useRoutes(routes); // Always called

//   return element;
// };

// export default Routers;


// import React, { useEffect, useState } from "react";
// import { Navigate, useRoutes } from "react-router-dom";
// import { AdminRoutes } from "./AdminRoutesWrapper";
// import { SuperadminRoutes } from "./SuperadminRoutesWrapper";
// import { EmployeeRoutes } from "./EmployeeRoutesWrapper";
// import Mains from "../mains";
// import LoginPage from "../pages/login";
// import { fetchProfile } from "../utils/api"; // Simulated API call to get user profile from token

// const Routers = () => {
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("access-token");

//   useEffect(() => {
//     const getUserRole = async () => {
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const profile = await fetchProfile(); // Should return { role, officeId, fullName }
//         if (profile?.role) {
//           const normalizedRole = profile.role.toLowerCase();
//           setRole(normalizedRole);

//           // Update user role in localStorage if needed
//           const user = JSON.parse(localStorage.getItem("user") || "{}");
//           if (!user.role || user.role.toLowerCase() !== normalizedRole) {
//             localStorage.setItem(
//               "user",
//               JSON.stringify({ ...user, role: normalizedRole })
//             );
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//         localStorage.removeItem("access-token");
//         localStorage.removeItem("user");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getUserRole();
//   }, [token]);

//   const selectRouteByRole = () => {
//     switch (role) {
//       case "superadmin":
//         return SuperadminRoutes;
//       case "admin":
//         return AdminRoutes;
//       case "employee":
//         return EmployeeRoutes;
//       default:
//         return [];
//     }
//   };

//   const isAuthenticated = token && role;

//   const routes = loading
//     ? [{ path: "*", element: <div className="text-center p-4">Loading...</div> }]
//     : [
//         {
//           path: "/",
//           element: isAuthenticated ? <Mains /> : <Navigate to="/login" replace />,
//           children: isAuthenticated ? selectRouteByRole() : [],
//         },
//         {
//           path: "/login",
//           element: isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />,
//         },
//         {
//           path: "*",
//           element: <Navigate to={isAuthenticated ? "/" : "/login"} replace />,
//         },
//       ];

//   return useRoutes(routes);
// };

// export default Routers;
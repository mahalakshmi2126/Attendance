// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const menuItemsByRole = {
//   superadmin: [
//     { path: '/clients', label: 'Clients' },
//     { path: '/trashClients', label: 'Trash Clients' },
//   ],
//   admin: [
//     { path: '/dashboard', label: 'Dashboard' },
//     { path: '/employees', label: 'Employees' },
//     { path: '/leave-requests', label: 'Leave Requests' },
//     { path: '/permission-requests', label: 'Permission Requests' },
//   ],
//   employee: [
//     { path: '/dashboard', label: 'Dashboard' },
//     { path: '/attendance', label: 'Attendance' },
//     { path: '/leave-request', label: 'Leave Request' },
//     { path: '/permission-request', label: 'Permission Request' },
//   ],
// };

// export default function Navbar({ role }) {
//   const menuItems = menuItemsByRole[role] || [];

//   return (
//     <nav className="bg-gray-800 p-4 text-white flex space-x-4">
//       {menuItems.map(({ path, label }) => (
//         <NavLink
//           key={path}
//           to={path}
//           className={({ isActive }) =>
//             isActive ? 'underline font-bold' : 'hover:underline'
//           }
//         >
//           {label}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }

// import { SuperAdminMenus } from "./SuperAdminMenu";
// import { AdminMenus } from "./AdminMenu";
// import { EmployeeMenus } from "./EmployeeMenu";

// // export enum Role {
// //     ADMIN = 'ADMIN',
// //     CLIENT = 'CLIENT',
// //     BACKENDDEVELOPER = 'BACKEND DEVELOPER'
// // }
// export const Role =  {
//     SuperAdmin : 'superadmin',
//     Admin : 'admin',
//     Employee : 'employee',
// }

// export const getRoleMenuItems = (role) => {

//     if (!role) { // if role is undefined or falsy, return DEFAULTMENUS
//         return [];
//     }

//     switch (role) {
//         case Role.SuperAdmin:
//             return SuperAdminMenus;
//         case Role.Admin:
//             return AdminMenus;
//         case Role.Employee:
//             return EmployeeMenus;
//         default:
//             return []
//     }
// }
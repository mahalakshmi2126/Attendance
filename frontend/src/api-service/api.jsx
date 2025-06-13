// // src/api/index.js

// export const getProfileApi = async () => {
//   const token = localStorage.getItem('access-token');

//   if (!token) {
//     throw new Error('No access token found');
//   }

//   const response = await fetch('/api/profile', {  // adjust endpoint as needed
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,   // send token in header
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to fetch profile');
//   }

//   const data = await response.json();
//   return data;
// };



import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token automatically to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

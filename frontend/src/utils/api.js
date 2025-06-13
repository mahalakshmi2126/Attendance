// src/utils/api.js
export const fetchProfile = async () => {
  const token = localStorage.getItem('access-token');

  const res = await fetch('http://localhost:5000/api/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch profile');

  return res.json();
};
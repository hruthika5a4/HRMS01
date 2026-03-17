import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const employeeAPI = {
  getAll: () => api.get('employees/'),
  getOne: (id) => api.get(`employees/${id}/`),
  create: (data) => api.post('employees/', data),
  update: (id, data) => api.put(`employees/${id}/`, data),
  delete: (id) => api.delete(`employees/${id}/`),
};

export const attendanceAPI = {
  getAll: (params) => api.get('attendance/', { params }),
  mark: (data) => api.post('attendance/', data),
  update: (id, data) => api.patch(`attendance/${id}/`, data),
  delete: (id) => api.delete(`attendance/${id}/`),
};

export default api;

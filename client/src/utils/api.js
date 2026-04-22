import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('shikshavid_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shikshavid_token');
      localStorage.removeItem('shikshavid_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update-profile', data),
};

// Teacher APIs
export const teacherAPI = {
  search: (params) => API.get('/teachers/search', { params }),
  getAll: () => API.get('/teachers'),
  getById: (id) => API.get(`/teachers/${id}`),
  getMapMarkers: (params) => API.get('/teachers/map', { params }),
  createProfile: (data) => API.post('/teachers/profile', data),
  updateProfile: (data) => API.put('/teachers/profile', data),
  getMyProfile: () => API.get('/teachers/my-profile'),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getTeacherBookings: () => API.get('/bookings/teacher-bookings'),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
};

// Review APIs
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getByTeacher: (teacherId) => API.get(`/reviews/teacher/${teacherId}`),
};

// Lead APIs
export const leadAPI = {
  track: (data) => API.post('/leads/track', data),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getTeachers: (params) => API.get('/admin/teachers', { params }),
  approveTeacher: (id) => API.put(`/admin/teachers/${id}/approve`),
  rejectTeacher: (id) => API.put(`/admin/teachers/${id}/reject`),
  verifyTeacher: (id) => API.put(`/admin/teachers/${id}/verify`),
  suspendTeacher: (id) => API.put(`/admin/teachers/${id}/suspend`),
  unsuspendTeacher: (id) => API.put(`/admin/teachers/${id}/unsuspend`),
  updateTeacher: (id, data) => API.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => API.delete(`/admin/teachers/${id}`),
  getBookings: (params) => API.get('/admin/bookings', { params }),
  updateBooking: (id, data) => API.put(`/admin/bookings/${id}`, data),
  getReviews: () => API.get('/admin/reviews'),
  approveReview: (id) => API.put(`/admin/reviews/${id}/approve`),
  deleteReview: (id) => API.delete(`/admin/reviews/${id}`),
  getLeads: (params) => API.get('/admin/leads', { params }),
  updateEnrollment: (id, data) => API.put(`/admin/teachers/${id}/enrollment`, data),
  getRevenue: () => API.get('/admin/revenue'),
  getContacts: (params) => API.get('/admin/contacts', { params }),
  updateContact: (id, data) => API.put(`/admin/contacts/${id}`, data),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserActive: (id) => API.put(`/admin/users/${id}/toggle-active`),
};

export default API;

import axios from 'axios';

const BASE_URL = 'http://localhost:8085';
const SESSION_KEY = 'wayfarer_session_v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const session = JSON.parse(raw);
      if (session?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch (e) {
      // ignore malformed session
    }
  }
  return config;
});

export const authApi = {
  login: (email, password) => apiClient.post('/api/auth/login', { email, password }),
  register: (body) => apiClient.post('/api/auth/register', body),
};

export const packageApi = {
  getPackages: () => apiClient.get('/api/packages'),
  getPackageById: (id) => apiClient.get(`/api/packages/${id}`),
  updatePackage: (id, body) => apiClient.put(`/api/packages/${id}`, body),
  deletePackage: (id) => apiClient.delete(`/api/packages/${id}`),
  addPackage: (body) => apiClient.post('/api/packages', body),
};

export const offerApi = {
  getOffers: () => apiClient.get('/api/offers'),
  getOfferById: (id) => apiClient.get(`/api/offers/${id}`),
  updateOffer: (id, body) => apiClient.put(`/api/offers/${id}`, body),
  deleteOffer: (id) => apiClient.delete(`/api/offers/${id}`),
  addOffer: (body) => apiClient.post('/api/offers', body),
};

export const contactApi = {
  getContacts: () => apiClient.get('/api/contacts'),
  addContact: (body) => apiClient.post('/api/contacts', body),
  deleteContact: (id) => apiClient.delete(`/api/contacts/${id}`),
  updateContact: (id) => apiClient.put(`/api/contacts/${id}/read`),
};

export const bookingApi = {
  getBookings: () => apiClient.get('/api/bookings'),
  getBookingById: (id) => apiClient.get(`/api/bookings/${id}`),
  deleteBooking: (id) => apiClient.delete(`/api/bookings/${id}`),
  addBookings: (body) => apiClient.post('/api/bookings', body),
  updateBookings: (id, body) => apiClient.put(`/api/bookings/${id}/status`, body),
};

export const userApi = {
  getUser: () => apiClient.get('/api/users'),
  deleteUser: (id) => apiClient.delete(`/api/users/${id}`),
};

export const reviewApi = {
  getReviews: () => apiClient.get('/api/reviews'),
};

export const destinationApi = {
  getDestinations: () => apiClient.get('/api/destinations'),
  getDestinationById: (id) => apiClient.get(`/api/destinations/${id}`),
};


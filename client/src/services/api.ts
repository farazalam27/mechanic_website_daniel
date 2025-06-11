import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getByPhone: async (phoneNumber: string) => {
    const response = await api.get(`/customers/phone/${phoneNumber}`);
    return response.data;
  },
  create: async (customerData: any) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },
  update: async (id: string, customerData: any) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

// Vehicle API
export const vehicleAPI = {
  getByCustomerId: async (customerId: string) => {
    const response = await api.get(`/vehicles/customer/${customerId}`);
    return response.data;
  },
  getByCustomerPhone: async (phoneNumber: string) => {
    const response = await api.get(`/vehicles/customer/phone/${phoneNumber}`);
    return response.data;
  },
  create: async (vehicleData: any) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },
  update: async (id: string, vehicleData: any) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};

// Appointment API
export const appointmentAPI = {
  getByCustomerId: async (customerId: string) => {
    const response = await api.get(`/appointments/customer/${customerId}`);
    return response.data;
  },
  getByCustomerPhone: async (phoneNumber: string) => {
    const response = await api.get(`/appointments/customer/phone/${phoneNumber}`);
    return response.data;
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get(`/appointments/date-range?start=${startDate}&end=${endDate}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },
  create: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  update: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
};

// Time Slot API
export const timeSlotAPI = {
  getAvailable: async (date?: string) => {
    const response = await api.get(`/time-slots${date ? `?date=${date}` : ''}`);
    return response.data;
  },
  getAvailableByDate: async (date: string) => {
    const response = await api.get(`/time-slots?date=${date}`);
    return response.data;
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get(`/time-slots/date-range?start=${startDate}&end=${endDate}`);
    return response.data;
  },
  create: async (timeSlotData: any) => {
    const response = await api.post('/time-slots', timeSlotData);
    return response.data;
  },
  update: async (id: string, timeSlotData: any) => {
    const response = await api.put(`/time-slots/${id}`, timeSlotData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/time-slots/${id}`);
    return response.data;
  },
  createBatch: async (batchData: any) => {
    const response = await api.post('/time-slots/batch', batchData);
    return response.data;
  },
};

export default api;

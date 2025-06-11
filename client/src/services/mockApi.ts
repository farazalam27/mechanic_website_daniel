import axios from 'axios';

// Mock data
const mockCustomers = [
  {
    _id: 'cust1',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '5551234567',
    email: 'john.smith@example.com',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    _id: 'cust2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '5559876543',
    email: 'sarah.johnson@example.com',
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  }
];

const mockVehicles = [
  {
    _id: 'veh1',
    customer: 'cust1',
    customerPhone: '5551234567',
    make: 'Toyota',
    modelName: 'Camry',
    year: 2020,
    engineType: 'V6 3.5L',
    oilType: '5W-30 Synthetic',
    color: 'Silver',
    licensePlate: 'ABC123'
  },
  {
    _id: 'veh2',
    customer: 'cust1',
    customerPhone: '5551234567',
    make: 'Honda',
    modelName: 'Civic',
    year: 2018,
    engineType: 'I4 2.0L',
    oilType: '0W-20 Synthetic',
    color: 'Blue',
    licensePlate: 'XYZ789'
  },
  {
    _id: 'veh3',
    customer: 'cust2',
    customerPhone: '5559876543',
    make: 'Ford',
    modelName: 'F-150',
    year: 2019,
    engineType: 'V8 5.0L',
    oilType: '5W-20 Synthetic',
    color: 'Red',
    licensePlate: 'DEF456'
  }
];

const mockAppointments = [
  {
    _id: 'app1',
    customer: {
      _id: 'cust1',
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '5551234567'
    },
    vehicle: {
      _id: 'veh2',
      make: 'Honda',
      modelName: 'Civic',
      year: 2018
    },
    date: '2025-06-11',
    startTime: '10:00',
    endTime: '11:00',
    serviceType: 'Oil Change',
    description: 'Regular maintenance',
    status: 'Scheduled'
  },
  {
    _id: 'app2',
    customer: {
      _id: 'cust1',
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '5551234567'
    },
    vehicle: {
      _id: 'veh1',
      make: 'Toyota',
      modelName: 'Camry',
      year: 2020
    },
    date: '2025-06-12',
    startTime: '10:00',
    endTime: '11:00',
    serviceType: 'Oil Change',
    description: 'Regular maintenance',
    status: 'Scheduled'
  },
  {
    _id: 'app3',
    customer: {
      _id: 'cust2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneNumber: '5559876543'
    },
    vehicle: {
      _id: 'veh3',
      make: 'Ford',
      modelName: 'F-150',
      year: 2019
    },
    date: '2025-06-13',
    startTime: '14:00',
    endTime: '15:00',
    serviceType: 'Maintenance',
    description: 'Tire rotation and alignment',
    status: 'Confirmed'
  }
];

const mockTimeSlots = [
  // June 11 slots - John Smith has appointment at 10-11am
  {
    _id: 'ts1',
    date: '2025-06-11',
    startTime: '09:00',
    endTime: '10:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts2',
    date: '2025-06-11',
    startTime: '10:00',
    endTime: '11:00',
    isBooked: true, // John Smith's Honda Civic oil change
    createdBy: 'admin'
  },
  {
    _id: 'ts3',
    date: '2025-06-11',
    startTime: '11:00',
    endTime: '12:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts3a',
    date: '2025-06-11',
    startTime: '14:00',
    endTime: '15:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts3b',
    date: '2025-06-11',
    startTime: '15:00',
    endTime: '16:00',
    isBooked: false,
    createdBy: 'admin'
  },
  // June 12 slots - John Smith has appointment at 10-11am
  {
    _id: 'ts4',
    date: '2025-06-12',
    startTime: '09:00',
    endTime: '10:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts5',
    date: '2025-06-12',
    startTime: '10:00',
    endTime: '11:00',
    isBooked: true, // John Smith's Toyota Camry oil change
    createdBy: 'admin'
  },
  {
    _id: 'ts6',
    date: '2025-06-12',
    startTime: '11:00',
    endTime: '12:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts6a',
    date: '2025-06-12',
    startTime: '14:00',
    endTime: '15:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts6b',
    date: '2025-06-12',
    startTime: '15:00',
    endTime: '16:00',
    isBooked: false,
    createdBy: 'admin'
  },
  // June 13 slots - Sarah Johnson has appointment at 2-3pm (14:00-15:00)
  {
    _id: 'ts7',
    date: '2025-06-13',
    startTime: '09:00',
    endTime: '10:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts8',
    date: '2025-06-13',
    startTime: '10:00',
    endTime: '11:00',
    isBooked: false, // This should be available!
    createdBy: 'admin'
  },
  {
    _id: 'ts9',
    date: '2025-06-13',
    startTime: '11:00',
    endTime: '12:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts10',
    date: '2025-06-13',
    startTime: '14:00',
    endTime: '15:00',
    isBooked: true, // Sarah Johnson's maintenance appointment
    createdBy: 'admin'
  },
  {
    _id: 'ts11',
    date: '2025-06-13',
    startTime: '15:00',
    endTime: '16:00',
    isBooked: false,
    createdBy: 'admin'
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a mock axios instance
const api = {
  get: async (url: string) => {
    await delay(300); // Simulate network delay
    
    // Customer endpoints
    if (url.startsWith('/customers/phone/')) {
      const phoneNumber = url.split('/').pop();
      const customer = mockCustomers.find(c => c.phoneNumber === phoneNumber);
      if (customer) {
        return { data: customer };
      }
      throw { response: { status: 404, data: { message: 'Customer not found' } } };
    }
    
    // Vehicle endpoints
    if (url.startsWith('/vehicles/customer/phone/')) {
      const phoneNumber = url.split('/').pop();
      const customer = mockCustomers.find(c => c.phoneNumber === phoneNumber);
      if (customer) {
        const vehicles = mockVehicles.filter(v => v.customer === customer._id);
        return { data: vehicles };
      }
      throw { response: { status: 404, data: { message: 'Customer not found' } } };
    }
    
    // Appointment endpoints
    if (url.startsWith('/appointments/customer/phone/')) {
      const phoneNumber = url.split('/').pop();
      const appointments = mockAppointments.filter(a => a.customer.phoneNumber === phoneNumber);
      return { data: appointments };
    }
    
    if (url.startsWith('/appointments/date-range/')) {
      const parts = url.split('/');
      const startDate = parts[parts.length - 2];
      const endDate = parts[parts.length - 1];
      // In a real implementation, we would filter by date range
      return { data: mockAppointments };
    }
    
    // Time slot endpoints
    if (url.startsWith('/time-slots/available/')) {
      const date = url.split('/').pop();
      const slots = mockTimeSlots.filter(s => s.date === date && !s.isBooked);
      return { data: slots };
    }
    
    if (url.startsWith('/time-slots/date-range/')) {
      const parts = url.split('/');
      const startDate = parts[parts.length - 2];
      const endDate = parts[parts.length - 1];
      
      const filteredSlots = mockTimeSlots.filter(slot => {
        const slotDate = slot.date.split('T')[0];
        return slotDate >= startDate && slotDate <= endDate;
      });
      
      return { data: filteredSlots };
    }
    
    return { data: [] };
  },
  
  post: async (url: string, data: any) => {
    await delay(300); // Simulate network delay
    
    if (url === '/customers') {
      const newCustomer = {
        _id: `cust${mockCustomers.length + 1}`,
        ...data
      };
      mockCustomers.push(newCustomer);
      return { data: newCustomer };
    }
    
    if (url === '/vehicles') {
      const newVehicle = {
        _id: `veh${mockVehicles.length + 1}`,
        ...data
      };
      mockVehicles.push(newVehicle);
      return { data: newVehicle };
    }
    
    if (url === '/appointments') {
      const customer = mockCustomers.find(c => c._id === data.customer);
      const vehicle = mockVehicles.find(v => v._id === data.vehicle);
      
      if (!customer || !vehicle) {
        throw { response: { status: 404, data: { message: 'Customer or vehicle not found' } } };
      }
      
      const newAppointment = {
        _id: `app${mockAppointments.length + 1}`,
        customer: {
          _id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phoneNumber: customer.phoneNumber
        },
        vehicle: {
          _id: vehicle._id,
          make: vehicle.make,
          modelName: vehicle.modelName,
          year: vehicle.year
        },
        ...data
      };
      
      mockAppointments.push(newAppointment);
      
      // Mark the corresponding time slot as booked
      const slotIndex = mockTimeSlots.findIndex(slot => 
        slot.date === data.date && 
        slot.startTime === data.startTime && 
        slot.endTime === data.endTime
      );
      
      if (slotIndex !== -1) {
        mockTimeSlots[slotIndex].isBooked = true;
      }
      
      return { data: newAppointment };
    }
    
    if (url === '/time-slots') {
      const newTimeSlot = {
        _id: `ts${mockTimeSlots.length + 1}`,
        isBooked: false,
        ...data
      };
      mockTimeSlots.push(newTimeSlot);
      return { data: newTimeSlot };
    }
    
    if (url === '/time-slots/batch') {
      const newSlots = data.slots.map((slot: any, index: number) => ({
        _id: `ts${mockTimeSlots.length + index + 1}`,
        isBooked: false,
        ...slot
      }));
      mockTimeSlots.push(...newSlots);
      return { data: newSlots };
    }
    
    return { data: {} };
  },
  
  put: async (url: string, data: any) => {
    await delay(300); // Simulate network delay
    
    if (url.startsWith('/customers/')) {
      const id = url.split('/').pop();
      const index = mockCustomers.findIndex(c => c._id === id);
      
      if (index !== -1) {
        mockCustomers[index] = { ...mockCustomers[index], ...data };
        return { data: mockCustomers[index] };
      }
      
      throw { response: { status: 404, data: { message: 'Customer not found' } } };
    }
    
    if (url.startsWith('/vehicles/')) {
      const id = url.split('/').pop();
      const index = mockVehicles.findIndex(v => v._id === id);
      
      if (index !== -1) {
        mockVehicles[index] = { ...mockVehicles[index], ...data };
        return { data: mockVehicles[index] };
      }
      
      throw { response: { status: 404, data: { message: 'Vehicle not found' } } };
    }
    
    if (url.startsWith('/time-slots/')) {
      const id = url.split('/').pop();
      const index = mockTimeSlots.findIndex(ts => ts._id === id);
      
      if (index !== -1) {
        mockTimeSlots[index] = { ...mockTimeSlots[index], ...data };
        return { data: mockTimeSlots[index] };
      }
      
      throw { response: { status: 404, data: { message: 'Time slot not found' } } };
    }
    
    return { data: {} };
  },
  
  patch: async (url: string, data: any) => {
    await delay(300); // Simulate network delay
    
    if (url.startsWith('/appointments/') && url.endsWith('/status')) {
      const id = url.split('/')[2];
      const index = mockAppointments.findIndex(a => a._id === id);
      
      if (index !== -1) {
        const appointment = mockAppointments[index];
        const oldStatus = appointment.status;
        mockAppointments[index] = { ...appointment, status: data.status };
        
        // If appointment is cancelled, free up the time slot
        if (data.status === 'Cancelled' && oldStatus !== 'Cancelled') {
          const slotIndex = mockTimeSlots.findIndex(slot => 
            slot.date === appointment.date && 
            slot.startTime === appointment.startTime && 
            slot.endTime === appointment.endTime
          );
          
          if (slotIndex !== -1) {
            mockTimeSlots[slotIndex].isBooked = false;
          }
        }
        
        return { data: mockAppointments[index] };
      }
      
      throw { response: { status: 404, data: { message: 'Appointment not found' } } };
    }
    
    return { data: {} };
  },
  
  delete: async (url: string) => {
    await delay(300); // Simulate network delay
    
    if (url.startsWith('/appointments/')) {
      const id = url.split('/').pop();
      const index = mockAppointments.findIndex(a => a._id === id);
      
      if (index !== -1) {
        const appointment = mockAppointments[index];
        mockAppointments.splice(index, 1);
        
        // Free up the time slot when appointment is deleted
        const slotIndex = mockTimeSlots.findIndex(slot => 
          slot.date === appointment.date && 
          slot.startTime === appointment.startTime && 
          slot.endTime === appointment.endTime
        );
        
        if (slotIndex !== -1) {
          mockTimeSlots[slotIndex].isBooked = false;
        }
        
        return { data: { message: 'Appointment deleted successfully' } };
      }
      
      throw { response: { status: 404, data: { message: 'Appointment not found' } } };
    }
    
    if (url.startsWith('/customers/')) {
      const id = url.split('/').pop();
      const index = mockCustomers.findIndex(c => c._id === id);
      
      if (index !== -1) {
        mockCustomers.splice(index, 1);
        return { data: { message: 'Customer deleted successfully' } };
      }
      
      throw { response: { status: 404, data: { message: 'Customer not found' } } };
    }
    
    if (url.startsWith('/vehicles/')) {
      const id = url.split('/').pop();
      const index = mockVehicles.findIndex(v => v._id === id);
      
      if (index !== -1) {
        mockVehicles.splice(index, 1);
        return { data: { message: 'Vehicle deleted successfully' } };
      }
      
      throw { response: { status: 404, data: { message: 'Vehicle not found' } } };
    }
    
    if (url.startsWith('/time-slots/')) {
      const id = url.split('/').pop();
      const index = mockTimeSlots.findIndex(ts => ts._id === id);
      
      if (index !== -1) {
        mockTimeSlots.splice(index, 1);
        return { data: { message: 'Time slot deleted successfully' } };
      }
      
      throw { response: { status: 404, data: { message: 'Time slot not found' } } };
    }
    
    return { data: {} };
  }
};

// Customer API
export const customerAPI = {
  getAll: () => Promise.resolve({ data: mockCustomers }),
  getByPhone: (phoneNumber: string) => api.get(`/customers/phone/${phoneNumber}`),
  create: (customerData: any) => api.post('/customers', customerData),
  update: (id: string, customerData: any) => api.put(`/customers/${id}`, customerData),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getVehicles: (customerId: string) => api.get(`/customers/${customerId}/vehicles`)
};

// Vehicle API
export const vehicleAPI = {
  getAll: () => Promise.resolve({ data: mockVehicles }),
  getByCustomerPhone: (phoneNumber: string) => api.get(`/vehicles/customer/phone/${phoneNumber}`),
  create: (vehicleData: any) => api.post('/vehicles', vehicleData),
  update: (id: string, vehicleData: any) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id: string) => api.delete(`/vehicles/${id}`)
};

// Appointment API
export const appointmentAPI = {
  getByCustomerPhone: (phoneNumber: string) => api.get(`/appointments/customer/phone/${phoneNumber}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/appointments/date-range/${startDate}/${endDate}`),
  create: (appointmentData: any) => api.post('/appointments', appointmentData),
  update: (id: string, appointmentData: any) => api.put(`/appointments/${id}`, appointmentData),
  updateStatus: (id: string, status: string) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/appointments/${id}`)
};

// Available Time Slot API
export const timeSlotAPI = {
  getAll: () => api.get('/time-slots'),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/time-slots/date-range/${startDate}/${endDate}`),
  getAvailableByDate: (date: string) => api.get(`/time-slots/available/${date}`),
  create: (timeSlotData: any) => api.post('/time-slots', timeSlotData),
  createBatch: (slots: any[]) => api.post('/time-slots/batch', { slots }),
  update: (id: string, timeSlotData: any) => api.put(`/time-slots/${id}`, timeSlotData),
  delete: (id: string) => api.delete(`/time-slots/${id}`)
};

// Auth API
export const authAPI = {
  adminLogin: async (username: string, password: string) => {
    await delay(300);
    // Mock admin credentials
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-admin-token-123',
        user: { id: 'admin1', username: 'admin', role: 'admin' }
      };
    }
    throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
  }
};

export default api;
import axios from 'axios';

// Mock data
const mockCustomers = [
  {
    _id: 'cust1',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '5551234567',
    email: 'john.doe@example.com'
  },
  {
    _id: 'cust2',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '5559876543',
    email: 'jane.smith@example.com'
  }
];

const mockVehicles = [
  {
    _id: 'veh1',
    customer: 'cust1',
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
      lastName: 'Doe',
      phoneNumber: '5551234567'
    },
    vehicle: {
      _id: 'veh1',
      make: 'Toyota',
      modelName: 'Camry',
      year: 2020
    },
    date: '2023-08-15',
    startTime: '10:00',
    endTime: '11:00',
    serviceType: 'Oil Change',
    description: 'Regular maintenance',
    status: 'Completed'
  },
  {
    _id: 'app2',
    customer: {
      _id: 'cust1',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '5551234567'
    },
    vehicle: {
      _id: 'veh2',
      make: 'Honda',
      modelName: 'Civic',
      year: 2018
    },
    date: '2023-09-20',
    startTime: '14:00',
    endTime: '15:00',
    serviceType: 'Repair',
    description: 'Check engine light is on',
    status: 'Scheduled'
  },
  {
    _id: 'app3',
    customer: {
      _id: 'cust2',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '5559876543'
    },
    vehicle: {
      _id: 'veh3',
      make: 'Ford',
      modelName: 'F-150',
      year: 2019
    },
    date: '2023-09-25',
    startTime: '09:00',
    endTime: '10:00',
    serviceType: 'Maintenance',
    description: 'Tire rotation and alignment',
    status: 'Confirmed'
  }
];

const mockTimeSlots = [
  {
    _id: 'ts1',
    date: '2023-09-20',
    startTime: '09:00',
    endTime: '10:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts2',
    date: '2023-09-20',
    startTime: '10:00',
    endTime: '11:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts3',
    date: '2023-09-20',
    startTime: '11:00',
    endTime: '12:00',
    isBooked: true,
    createdBy: 'admin'
  },
  {
    _id: 'ts4',
    date: '2023-09-21',
    startTime: '09:00',
    endTime: '10:00',
    isBooked: false,
    createdBy: 'admin'
  },
  {
    _id: 'ts5',
    date: '2023-09-21',
    startTime: '10:00',
    endTime: '11:00',
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
      // In a real implementation, we would filter by date range
      return { data: mockTimeSlots };
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
        mockAppointments[index] = { ...mockAppointments[index], status: data.status };
        return { data: mockAppointments[index] };
      }
      
      throw { response: { status: 404, data: { message: 'Appointment not found' } } };
    }
    
    return { data: {} };
  },
  
  delete: async (url: string) => {
    await delay(300); // Simulate network delay
    
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
  getByPhone: (phoneNumber: string) => api.get(`/customers/phone/${phoneNumber}`),
  create: (customerData: any) => api.post('/customers', customerData),
  update: (id: string, customerData: any) => api.put(`/customers/${id}`, customerData),
  getVehicles: (customerId: string) => api.get(`/customers/${customerId}/vehicles`)
};

// Vehicle API
export const vehicleAPI = {
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

export default api;
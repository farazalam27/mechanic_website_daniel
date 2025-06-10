# Daniel's Mechanic Shop Website

> **IMPORTANT NOTICE**: This application is currently configured for **frontend-only mode** with mock data. The backend is disabled. To run the application, use `./run-frontend.sh` or `npm run frontend:only`. See the [Frontend-Only Mode](#frontend-only-mode-with-mock-data) section for details.

A full-stack web application for a mechanic shop, featuring customer management, vehicle tracking, and appointment scheduling.

## Project Structure

This project consists of two main parts:
- **Backend**: Node.js with Express and TypeScript
- **Frontend**: React with TypeScript and Bootstrap

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Setting Up the Project

#### 1. Install Backend Dependencies

Yes, you do need to run `npm install` to set up the project. This command installs all the dependencies listed in the package.json file. From the root directory of the project, run:

```bash
npm install
```

This will install all the backend dependencies like Express, Mongoose, TypeScript, etc.

#### 2. Install Frontend Dependencies

Next, navigate to the client directory and install the frontend dependencies:

```bash
cd client
npm install
```

This will install React, React Router, Bootstrap, and other frontend dependencies.

#### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/daniel_mechanic
NODE_ENV=development
```

Adjust the `MONGO_URI` if you're using MongoDB Atlas or a different configuration.

## Running the Application

### Development Mode

To run both the backend and frontend in development mode, use the following command from the root directory:

```bash
npm run dev:full
```

This will start:
- The backend server on http://localhost:5000
- The frontend development server on http://localhost:3000

### Running Backend Only

```bash
npm run dev
```

### Running Frontend Only

#### Standard Mode (Requires Backend)

```bash
cd client
npm start
```

#### Frontend-Only Mode with Mock Data

This mode allows you to run and demonstrate the frontend without needing to set up the backend or database. All API calls use mock data instead of real data from the server.

**Option 1: Using the convenience script (recommended)**

```bash
./run-frontend.sh
```

This script will:
- Check if npm is installed
- Install frontend dependencies if needed
- Start the frontend server with mock data

**Option 2: Using npm directly**

```bash
npm run frontend:only
```

This is useful for:
- Demonstrating the UI without backend setup
- Frontend development without backend dependencies
- Quick demos of the application's features

**Note**: In this mode, all data is mocked and changes will not persist between sessions.

## Building for Production

### Build Backend

```bash
npm run build
```

### Build Frontend

```bash
cd client
npm run build
```

### Run Production Build

```bash
npm start
```

## Features

- Customer management
- Vehicle tracking
- Appointment scheduling
- Admin dashboard for managing time slots
- Responsive design for all devices

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - TypeScript
  - MongoDB with Mongoose
  - RESTful API

- **Frontend**:
  - React
  - TypeScript
  - React Bootstrap
  - React Router
  - Axios for API requests

## Frontend-Only Mode Implementation

The application has been configured to run in frontend-only mode with mock data. The following changes were made:

1. **Backend Code**: The backend code in `src/index.ts` has been commented out and replaced with a message indicating that the backend is disabled.

2. **API Service**: A new file `client/src/services/mockApi.ts` has been created with mock implementations of all API endpoints. The original `api.ts` file now imports and re-exports these mock implementations.

3. **Scripts**: A new npm script `frontend:only` has been added to `package.json` to run only the frontend.

4. **Convenience Script**: A shell script `run-frontend.sh` has been created to make it easier to run the frontend-only mode.

### Reverting to Full-Stack Mode

If you want to revert back to the full-stack mode with a real backend:

1. Uncomment the backend code in `src/index.ts` (remove the comment markers `/*` and `*/`).

2. Restore the original API service by replacing the content of `client/src/services/api.ts` with:

```typescript
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
```

3. Run the full-stack application using:

```bash
npm run dev:full
```

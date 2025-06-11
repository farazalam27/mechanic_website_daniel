# Daniel's Mechanic Shop Management System

A full-stack web application for managing a mechanic shop's operations, including customer management, vehicle tracking, appointment scheduling, and service management.

## Features

### Customer Portal
- **Phone Number Login**: Customers can access their dashboard using just their phone number
- **Vehicle Management**: Add, edit, and delete vehicles with detailed specifications
- **Appointment Booking**: Schedule service appointments with real-time availability
- **Service History**: View past and upcoming appointments

### Admin Dashboard
- **Customer Management**: View and manage all customer information
- **Appointment Overview**: See all scheduled appointments with filtering options
- **Time Slot Management**: Create and manage available appointment slots

### Key Features
- 📱 Mobile-responsive design
- 🔐 Secure customer authentication via phone number
- 📅 Real-time appointment scheduling
- 🚗 Comprehensive vehicle tracking
- 📊 Service history and management

## Tech Stack

### Frontend
- **React** with TypeScript
- **React Bootstrap** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for iconography

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farazalam27/mechanic_website_daniel.git
   cd mechanic_website_daniel
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/daniel_mechanic
   NODE_ENV=development
   ```
   
   For MongoDB Atlas (recommended):
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/daniel_mechanic
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```
   This will create sample data including customers, vehicles, and available time slots.

### Running the Application

**Development Mode (Full Stack)**
```bash
npm run dev:full
```
This starts both the backend server (port 5001) and frontend development server (port 3000).

**Backend Only**
```bash
npm run dev
```

**Frontend Only**
```bash
npm run frontend:only
```

### Default Test Accounts

After running the database initialization, you can log in with these phone numbers:
- (555) 123-4567 - John Smith
- (555) 987-6543 - Sarah Johnson
- (555) 555-5555 - Mike Davis
- (555) 246-8013 - Robert Williams
- (555) 357-1590 - Jennifer Brown
- (555) 468-2470 - David Jones

## Project Structure

```
mechanic_website_daniel/
├── src/                    # Backend source code
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   └── scripts/           # Database scripts
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── assets/       # Images and static files
│   └── public/           # Public assets
└── README.md
```

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/phone/:phoneNumber` - Get customer by phone
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/customer/phone/:phoneNumber` - Get vehicles by customer phone
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/customer/phone/:phoneNumber` - Get appointments by customer phone
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Time Slots
- `GET /api/time-slots` - Get available time slots
- `POST /api/time-slots` - Create time slot
- `POST /api/time-slots/batch` - Create multiple time slots

## Preparing for Deployment

### Before Pushing to GitHub

1. **Environment Variables**: Never commit `.env` files. Make sure `.env` is in your `.gitignore`

2. **Create `.env.example`**: Create a template for others to use:
   ```bash
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

3. **Clean up test files**: Remove any temporary test scripts

### Deployment Options

#### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

**Backend on Render:**
1. Push your code to GitHub
2. Sign up at [render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables (PORT, MONGO_URI)

**Frontend on Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. In the client directory: 
   ```bash
   cd client
   vercel
   ```
3. Follow the prompts
4. Add environment variable: `REACT_APP_API_URL` = your Render backend URL

#### Option 2: Deploy to Heroku (Full Stack)

1. Install Heroku CLI
2. Create a `Procfile` in root:
   ```
   web: node dist/index.js
   ```

3. Create Heroku app:
   ```bash
   heroku create daniels-mechanic-shop
   heroku addons:create mongolab:sandbox
   git push heroku main
   ```

#### Option 3: Deploy to Railway

1. Push to GitHub
2. Sign up at [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add MongoDB plugin
5. Deploy

### Demo Mode

For client demonstrations without full deployment:

1. Use the frontend-only mode with mock data:
   ```bash
   npm run frontend:only
   ```

2. Deploy just the frontend to Vercel/Netlify for a quick demo
3. The mock API will provide realistic data for demonstrations

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.

---

Built with ❤️ for Daniel's Mechanic Shop
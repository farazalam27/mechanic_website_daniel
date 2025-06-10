import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import AvailableTimeSlot from '../models/AvailableTimeSlot';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/daniel_mechanic';

async function initDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - remove if you want to keep existing data)
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await AvailableTimeSlot.deleteMany({});
    console.log('Cleared existing data');

    // Create sample customers
    const customers = await Customer.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        phoneNumber: '5551234567',
        email: 'john.smith@email.com'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        phoneNumber: '5559876543',
        email: 'sarah.johnson@email.com'
      },
      {
        firstName: 'Mike',
        lastName: 'Davis',
        phoneNumber: '5555555555',
        email: 'mike.davis@email.com'
      }
    ]);
    console.log('Created sample customers');

    // Create sample vehicles
    const vehicles = await Vehicle.insertMany([
      {
        customerPhone: '5551234567',
        make: 'Toyota',
        modelName: 'Camry',
        year: 2020,
        engineType: '2.5L 4-Cylinder',
        oilType: '0W-20 Synthetic',
        color: 'Silver',
        licensePlate: 'ABC123',
        notes: 'Customer prefers appointments in the morning'
      },
      {
        customerPhone: '5551234567',
        make: 'Honda',
        modelName: 'Civic',
        year: 2018,
        engineType: '1.5L Turbo',
        oilType: '0W-20 Synthetic',
        color: 'Blue',
        licensePlate: 'XYZ789'
      },
      {
        customerPhone: '5559876543',
        make: 'Ford',
        modelName: 'F-150',
        year: 2021,
        engineType: '5.0L V8',
        oilType: '5W-30 Synthetic',
        color: 'Black',
        licensePlate: 'TRUCK1',
        notes: 'Heavy duty truck, requires extra time for service'
      },
      {
        customerPhone: '5555555555',
        make: 'Chevrolet',
        modelName: 'Malibu',
        year: 2019,
        engineType: '1.5L Turbo',
        oilType: '5W-30 Conventional',
        color: 'White',
        licensePlate: 'CHEVY99'
      }
    ]);
    console.log('Created sample vehicles');

    // Create available time slots for the next 7 days
    const timeSlots = [];
    const today = new Date();
    
    for (let day = 1; day <= 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Create time slots from 8 AM to 5 PM
      const slots = [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' }, // Skip lunch hour
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' }
      ];
      
      for (const slot of slots) {
        timeSlots.push({
          date: date.toISOString().split('T')[0],
          startTime: slot.start,
          endTime: slot.end,
          isBooked: false,
          createdBy: 'admin'
        });
      }
    }
    
    await AvailableTimeSlot.insertMany(timeSlots);
    console.log('Created available time slots');

    console.log('Database initialization completed successfully!');
    console.log(`Created ${customers.length} customers`);
    console.log(`Created ${vehicles.length} vehicles`);
    console.log(`Created ${timeSlots.length} time slots`);

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initDatabase();
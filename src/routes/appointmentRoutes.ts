import * as express from 'express';
import { Request, Response } from 'express';
import Appointment, { AppointmentStatus, ServiceType } from '../models/Appointment';
import Customer from '../models/Customer';
import Vehicle from '../models/Vehicle';
import AvailableTimeSlot from '../models/AvailableTimeSlot';

const router = express.Router();

// Get all appointments
router.get('/', async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year')
      .sort({ date: 1, startTime: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Get appointment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year engineType oilType');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error });
  }
});

// Get appointments by date range (query params)
router.get('/date-range', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(start as string),
        $lte: new Date(end as string)
      }
    })
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year')
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Get appointments by date range (path params - legacy)
router.get('/date-range/:startDate/:endDate', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.params;
    
    const appointments = await Appointment.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year')
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Get appointments by customer phone number
router.get('/customer/phone/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({ phoneNumber: req.params.phoneNumber });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const appointments = await Appointment.find({ customer: customer._id })
      .populate('vehicle', 'make model year')
      .sort({ date: -1, startTime: 1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Create new appointment
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check if customer exists
    const customer = await Customer.findById(req.body.customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(req.body.vehicle);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if the time slot is available
    const { date, startTime, endTime } = req.body;
    const timeSlot = await AvailableTimeSlot.findOne({
      date: new Date(date),
      startTime,
      endTime,
      isBooked: false
    });
    
    if (!timeSlot) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }
    
    // Create the appointment
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    
    // Mark the time slot as booked
    timeSlot.isBooked = true;
    await timeSlot.save();
    
    // Populate customer and vehicle data before returning
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year engineType oilType');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
});

// Update appointment
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // If date or time is being changed, check availability
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const date = req.body.date || appointment.date;
      const startTime = req.body.startTime || appointment.startTime;
      const endTime = req.body.endTime || appointment.endTime;
      
      // If the appointment is being rescheduled, free up the old time slot
      if (
        date.toString() !== appointment.date.toString() ||
        startTime !== appointment.startTime ||
        endTime !== appointment.endTime
      ) {
        // Find and update the old time slot
        const oldTimeSlot = await AvailableTimeSlot.findOne({
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime
        });
        
        if (oldTimeSlot) {
          oldTimeSlot.isBooked = false;
          await oldTimeSlot.save();
        }
        
        // Check if the new time slot is available
        const newTimeSlot = await AvailableTimeSlot.findOne({
          date: new Date(date),
          startTime,
          endTime,
          isBooked: false
        });
        
        if (!newTimeSlot) {
          return res.status(400).json({ message: 'Selected time slot is not available' });
        }
        
        // Mark the new time slot as booked
        newTimeSlot.isBooked = true;
        await newTimeSlot.save();
      }
    }
    
    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year engineType oilType');
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment', error });
  }
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Free up the time slot
    const timeSlot = await AvailableTimeSlot.findOne({
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime
    });
    
    if (timeSlot) {
      timeSlot.isBooked = false;
      await timeSlot.save();
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
});

// Update appointment status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!Object.values(AppointmentStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('customer', 'firstName lastName phoneNumber')
      .populate('vehicle', 'make model year');
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment status', error });
  }
});

export default router;
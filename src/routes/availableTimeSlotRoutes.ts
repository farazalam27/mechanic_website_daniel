import * as express from 'express';
import { Request, Response } from 'express';
import AvailableTimeSlot from '../models/AvailableTimeSlot';
import Appointment from '../models/Appointment';

const router = express.Router();

// Get all available time slots (with optional date filter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    let query = {};
    
    if (date) {
      const dateObj = new Date(date as string);
      dateObj.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateObj);
      endDate.setHours(23, 59, 59, 999);
      
      query = {
        date: {
          $gte: dateObj,
          $lte: endDate
        }
      };
    }
    
    const timeSlots = await AvailableTimeSlot.find(query)
      .sort({ date: 1, startTime: 1 });
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time slots', error });
  }
});

// Get available time slots by date range (query params)
router.get('/date-range', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    
    const timeSlots = await AvailableTimeSlot.find({
      date: {
        $gte: new Date(start as string),
        $lte: new Date(end as string)
      }
    }).sort({ date: 1, startTime: 1 });
    
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time slots', error });
  }
});

// Get available time slots by date range (path params - legacy)
router.get('/date-range/:startDate/:endDate', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.params;
    
    const timeSlots = await AvailableTimeSlot.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1, startTime: 1 });
    
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time slots', error });
  }
});

// Get available (not booked) time slots by date
router.get('/available/:date', async (req: Request, res: Response) => {
  try {
    const date = new Date(req.params.date);
    
    // Set time to 00:00:00 for the start of the day
    date.setHours(0, 0, 0, 0);
    
    // Create end date (end of the day)
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const timeSlots = await AvailableTimeSlot.find({
      date: {
        $gte: date,
        $lte: endDate
      },
      isBooked: false
    }).sort({ startTime: 1 });
    
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available time slots', error });
  }
});

// Create new time slot
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check for overlapping time slots on the same date
    const { date, startTime, endTime } = req.body;
    const existingSlot = await AvailableTimeSlot.findOne({
      date: new Date(date),
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });
    
    if (existingSlot) {
      return res.status(400).json({ 
        message: 'Time slot overlaps with an existing slot',
        existingSlot
      });
    }
    
    const newTimeSlot = new AvailableTimeSlot(req.body);
    const savedTimeSlot = await newTimeSlot.save();
    
    res.status(201).json(savedTimeSlot);
  } catch (error) {
    res.status(400).json({ message: 'Error creating time slot', error });
  }
});

// Create multiple time slots (batch creation)
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { slots } = req.body;
    
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'Invalid slots data. Expected an array of time slots.' });
    }
    
    // Check for overlapping time slots
    for (const slot of slots) {
      const { date, startTime, endTime } = slot;
      const existingSlot = await AvailableTimeSlot.findOne({
        date: new Date(date),
        $or: [
          {
            startTime: { $lte: startTime },
            endTime: { $gt: startTime }
          },
          {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime }
          },
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime }
          }
        ]
      });
      
      if (existingSlot) {
        return res.status(400).json({ 
          message: 'Time slot overlaps with an existing slot',
          slot,
          existingSlot
        });
      }
    }
    
    // Create all time slots
    const createdSlots = await AvailableTimeSlot.insertMany(slots);
    
    res.status(201).json(createdSlots);
  } catch (error) {
    res.status(400).json({ message: 'Error creating time slots', error });
  }
});

// Update time slot
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const timeSlot = await AvailableTimeSlot.findById(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    // If the time slot is booked, don't allow changes to date or time
    if (timeSlot.isBooked && (req.body.date || req.body.startTime || req.body.endTime)) {
      return res.status(400).json({ 
        message: 'Cannot modify date or time of a booked time slot' 
      });
    }
    
    // If changing date or time, check for overlaps
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const date = req.body.date || timeSlot.date;
      const startTime = req.body.startTime || timeSlot.startTime;
      const endTime = req.body.endTime || timeSlot.endTime;
      
      const existingSlot = await AvailableTimeSlot.findOne({
        _id: { $ne: req.params.id },
        date: new Date(date),
        $or: [
          {
            startTime: { $lte: startTime },
            endTime: { $gt: startTime }
          },
          {
            startTime: { $lt: endTime },
            endTime: { $gte: endTime }
          },
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime }
          }
        ]
      });
      
      if (existingSlot) {
        return res.status(400).json({ 
          message: 'Time slot overlaps with an existing slot',
          existingSlot
        });
      }
    }
    
    const updatedTimeSlot = await AvailableTimeSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTimeSlot);
  } catch (error) {
    res.status(400).json({ message: 'Error updating time slot', error });
  }
});

// Delete time slot
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const timeSlot = await AvailableTimeSlot.findById(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    // Check if the time slot is booked
    if (timeSlot.isBooked) {
      // Find the appointment using this time slot
      const appointment = await Appointment.findOne({
        date: timeSlot.date,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      });
      
      if (appointment) {
        return res.status(400).json({ 
          message: 'Cannot delete a booked time slot. Cancel the appointment first.',
          appointmentId: appointment._id
        });
      }
    }
    
    await AvailableTimeSlot.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting time slot', error });
  }
});

export default router;
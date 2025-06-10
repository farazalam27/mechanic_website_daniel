import * as express from 'express';
import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import Customer from '../models/Customer';
import Appointment from '../models/Appointment';

const router = express.Router();

// Get all vehicles
router.get('/', async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('customer', 'firstName lastName phoneNumber')
      .sort({ make: 1, modelName: 1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
});

// Get vehicle by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('customer', 'firstName lastName phoneNumber');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error });
  }
});

// Get vehicles by customer phone number
router.get('/customer/phone/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({ phoneNumber: req.params.phoneNumber });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const vehicles = await Vehicle.find({ customer: customer._id });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
});

// Create new vehicle
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check if customer exists
    const customer = await Customer.findById(req.body.customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();

    // Populate customer data before returning
    const populatedVehicle = await Vehicle.findById(savedVehicle._id)
      .populate('customer', 'firstName lastName phoneNumber');

    res.status(201).json(populatedVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle', error });
  }
});

// Update vehicle
router.put('/:id', async (req: Request, res: Response) => {
  try {
    // If customer ID is being updated, check if the new customer exists
    if (req.body.customer) {
      const customer = await Customer.findById(req.body.customer);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'firstName lastName phoneNumber');

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Error updating vehicle', error });
  }
});

// Delete vehicle
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle has appointments
    const appointments = await Appointment.find({ vehicle: req.params.id });
    if (appointments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete vehicle with associated appointments. Delete appointments first.' 
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error });
  }
});

export default router;

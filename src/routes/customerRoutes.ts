import * as express from 'express';
import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';
import Vehicle from '../models/Vehicle';

const router = express.Router();

// Get all customers
router.get('/', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ lastName: 1, firstName: 1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
});

// Get customer by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// Get customer by phone number
router.get('/phone/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({ phoneNumber: req.params.phoneNumber });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// Create new customer
router.post('/', async (req: Request, res: Response) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating customer', error });
  }
});

// Update customer
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer', error });
  }
});

// Delete customer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Check if customer has vehicles
    const vehicles = await Vehicle.find({ customerPhone: customer.phoneNumber });
    if (vehicles.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete customer with associated vehicles. Delete vehicles first.' 
      });
    }
    
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});

// Get all vehicles for a customer by phone number
router.get('/phone/:phoneNumber/vehicles', async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find({ customerPhone: req.params.phoneNumber });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
});

export default router;
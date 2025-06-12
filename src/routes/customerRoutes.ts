import * as express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
    const customerData = { ...req.body };
    
    // Hash password if provided
    if (customerData.password) {
      const salt = await bcrypt.genSalt(10);
      customerData.password = await bcrypt.hash(customerData.password, salt);
    }
    
    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();
    
    // Don't send password back in response
    const customerResponse = savedCustomer.toObject();
    delete customerResponse.password;
    
    res.status(201).json(customerResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating customer', error });
  }
});

// Update customer
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    
    // Hash password if being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Don't send password back in response
    const customerResponse = updatedCustomer.toObject();
    delete customerResponse.password;
    
    res.status(200).json(customerResponse);
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

// Add password to existing customer (for testing)
router.patch('/:id/password', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Don't send password back in response
    const customerResponse = updatedCustomer.toObject();
    delete customerResponse.password;
    
    res.status(200).json(customerResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error adding password', error });
  }
});

export default router;
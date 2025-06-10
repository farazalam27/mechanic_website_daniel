import mongoose, { Document, Schema } from 'mongoose';
import { ICustomer } from './Customer';

// Interface for Vehicle document
export interface IVehicle extends Document {
  customerPhone: string;
  make: string;
  modelName: string;
  year: number;
  engineType: string;
  oilType: string;
  licensePlate?: string;
  vin?: string;
  color?: string;
  lastServiceDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Vehicle
const VehicleSchema: Schema = new Schema(
  {
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true
    },
    modelName: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    engineType: {
      type: String,
      required: [true, 'Engine type is required'],
      trim: true
    },
    oilType: {
      type: String,
      required: [true, 'Oil type is required'],
      trim: true
    },
    licensePlate: {
      type: String,
      trim: true
    },
    vin: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    lastServiceDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Vehicle model
export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);

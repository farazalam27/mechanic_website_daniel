import mongoose, { Document, Schema } from 'mongoose';
import { ICustomer } from './Customer';
import { IVehicle } from './Vehicle';

// Enum for service types
export enum ServiceType {
  OIL_CHANGE = 'Oil Change',
  REPAIR = 'Repair',
  MAINTENANCE = 'Maintenance',
  INSPECTION = 'Inspection',
  OTHER = 'Other'
}

// Enum for appointment status
export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

// Interface for Appointment document
export interface IAppointment extends Document {
  customer: ICustomer['_id'];
  vehicle: IVehicle['_id'];
  date: Date;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
  description?: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Appointment
const AppointmentSchema: Schema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required']
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required']
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in format HH:MM']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in format HH:MM']
    },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: [true, 'Service type is required']
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED
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

// Create and export the Appointment model
export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
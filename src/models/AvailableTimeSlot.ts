import mongoose, { Document, Schema } from 'mongoose';

// Interface for AvailableTimeSlot document
export interface IAvailableTimeSlot extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdBy: string; // ID of the head mechanic who created this slot
  createdAt: Date;
  updatedAt: Date;
}

// Schema for AvailableTimeSlot
const AvailableTimeSlotSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required']
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
    isBooked: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: String,
      required: [true, 'Creator ID is required']
    }
  },
  {
    timestamps: true
  }
);

// Create and export the AvailableTimeSlot model
export default mongoose.model<IAvailableTimeSlot>('AvailableTimeSlot', AvailableTimeSlotSchema);
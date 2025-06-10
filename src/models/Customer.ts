import mongoose, { Document, Schema } from 'mongoose';

// Interface for Customer document
export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Customer
const CustomerSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Customer model
export default mongoose.model<ICustomer>('Customer', CustomerSchema);
// models/Registration.ts (without status field)
import mongoose from 'mongoose';

export interface IRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  university: string;
  graduationYear: string;
  currentLocation: string;
  registeredAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new mongoose.Schema<IRegistration>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true, // Add this to prevent duplicate phone numbers
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
    },
    graduationYear: {
      type: String,
      required: [true, 'Graduation year is required'],
      match: [/^\d{4}$/, 'Please provide a valid year'],
    },
    currentLocation: {
      type: String,
      required: [true, 'Current location is required'],
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'registeredAt',
      updatedAt: 'updatedAt',
    },
  }
);

// Create indexes for better query performance
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ phoneNumber: 1 });
RegistrationSchema.index({ createdAt: -1 });
RegistrationSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phoneNumber: 'text' });

// Prevent model recompilation in development
const Registration = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;
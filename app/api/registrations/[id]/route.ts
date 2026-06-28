// app/api/registrations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { verifyAuth, verifyAdmin } from '@/lib/auth';

// GET /api/registrations/[id] - Get single registration (authenticated users)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Await params before accessing
    const { id } = await params;
    const registration = await Registration.findById(id);
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/registrations/[id] - Update registration (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access (only admins can update)
    const authResult = await verifyAdmin(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    await dbConnect();

    // Await params before accessing
    const { id } = await params;

    // Find registration
    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Update fields
    const updates = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'university', 'campus', 'department', 'graduationYear', 
      'currentLocation', 'status'
    ];
    
    const updatedData: any = {};
    let hasUpdates = false;
    
    updates.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        updatedData[field] = body[field];
        hasUpdates = true;
      }
    });

    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // If email is being updated, check for duplicates
    if (updatedData.email && updatedData.email !== registration.email) {
      const existingEmail = await Registration.findOne({ 
        email: updatedData.email,
        _id: { $ne: id }
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    // If phone is being updated, check for duplicates
    if (updatedData.phoneNumber && updatedData.phoneNumber !== registration.phoneNumber) {
      const existingPhone = await Registration.findOne({
        phoneNumber: updatedData.phoneNumber,
        _id: { $ne: id }
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        );
      }
    }

    // Update registration
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration,
    });
  } catch (error: any) {
    console.error('Error updating registration:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/registrations/[id] - Delete registration (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access (only admins can delete)
    const authResult = await verifyAdmin(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Await params before accessing
    const { id } = await params;

    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    await Registration.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/registrations/[id] - Partial update (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Same as PUT but with partial updates
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    await dbConnect();

    // Await params before accessing
    const { id } = await params;

    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Only update fields that are provided
    const updates = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'university', 'campus', 'department', 'graduationYear', 
      'currentLocation', 'status', 'registeredAt'
    ];
    
    const updatedData: any = {};
    
    updates.forEach(field => {
      if (body[field] !== undefined) {
        updatedData[field] = body[field];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Check for duplicate email if updated
    if (updatedData.email && updatedData.email !== registration.email) {
      const existingEmail = await Registration.findOne({
        email: updatedData.email,
        _id: { $ne: id }
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    // Check for duplicate phone if updated
    if (updatedData.phoneNumber && updatedData.phoneNumber !== registration.phoneNumber) {
      const existingPhone = await Registration.findOne({
        phoneNumber: updatedData.phoneNumber,
        _id: { $ne: id }
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Phone number already registered' },
          { status: 409 }
        );
      }
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      data: updatedRegistration,
    });
  } catch (error: any) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
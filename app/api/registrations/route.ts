// app/api/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { verifyAuth, verifyAdmin } from '@/lib/auth';

// GET /api/registrations - Get all registrations (authenticated users only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication (only authenticated users can view registrations)
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const university = searchParams.get('university');
    const department = searchParams.get('department');

    // Build query
    let query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    if (university) {
      query.university = university;
    }

    if (department) {
      query.department = department;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const registrations = await Registration.find(query)
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Registration.countDocuments(query);

    // Get total statistics (for all data, not filtered)
    const totalStats = await Registration.aggregate([
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          uniqueUniversities: [
            { $group: { _id: '$university' } },
            { $count: 'count' }
          ],
          thisMonth: [
            {
              $match: {
                registeredAt: {
                  $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
              }
            },
            { $count: 'count' }
          ],
          uniqueLocations: [
            { $group: { _id: '$currentLocation' } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const stats = {
      total: totalStats[0]?.totalCount[0]?.count || 0,
      universities: totalStats[0]?.uniqueUniversities[0]?.count || 0,
      thisMonth: totalStats[0]?.thisMonth[0]?.count || 0,
      countries: totalStats[0]?.uniqueLocations[0]?.count || 0,
    };

    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
      user: authResult.user,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/registrations - Create new registration (PUBLIC - No auth required)
export async function POST(request: NextRequest) {
  console.log('🔵 POST /api/registrations - Public endpoint called');
  
  try {
    const body = await request.json();
    console.log('🔵 Request body:', body);
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'university', 'campus', 'department', 'graduationYear', 'currentLocation'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`🔴 Missing field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    await dbConnect();
    console.log('🟢 Database connected');

    // Check if email already exists
    const existingEmail = await Registration.findOne({ email: body.email });
    if (existingEmail) {
      console.log('🔴 Email already exists:', body.email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const existingPhone = await Registration.findOne({ phoneNumber: body.phoneNumber });
    if (existingPhone) {
      console.log('🔴 Phone already exists:', body.phoneNumber);
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    // Create new registration (NO AUTH REQUIRED)
    const registration = await Registration.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      university: body.university,
      campus: body.campus,
      department: body.department,
      graduationYear: body.graduationYear,
      currentLocation: body.currentLocation,
      // No createdBy field since no auth
    });

    console.log('🟢 Registration created:', registration._id);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('🔴 Error creating registration:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already registered` },
        { status: 409 }
      );
    }

    // Handle validation errors
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
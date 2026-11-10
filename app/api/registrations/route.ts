// app/api/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { verifyAuth } from '@/lib/auth';
import { buildRegistrationQuery } from '@/lib/registration-query';

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

    const { searchParams } = new URL(request.url);
    const { query, sort, page, limit } = buildRegistrationQuery(searchParams);

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const registrations = await Registration.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Registration.countDocuments(query);

    // Calendar boundaries follow the workspace timezone (UTC+3).
    const localNow = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const year = localNow.getUTCFullYear();
    const month = localNow.getUTCMonth();
    const monthStart = (offset: number) => new Date(Date.UTC(year, month + offset, 1) - 3 * 60 * 60 * 1000);

    // Get total statistics (for all data, not filtered)
    const totalStats = await Registration.aggregate([
      {
        $facet: {
          topUniversities: [
            { $group: { _id: '$university', count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 5 },
          ],
          monthlyRegistrations: [
            { $match: { registeredAt: { $gte: monthStart(-5) } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$registeredAt', timezone: 'Africa/Addis_Ababa' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          totalCount: [{ $count: 'count' }],
          uniqueUniversities: [
            { $group: { _id: '$university' } },
            { $count: 'count' }
          ],
          thisMonth: [
            {
              $match: {
                registeredAt: {
                  $gte: monthStart(0),
                  $lt: monthStart(1)
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
      insights: {
        topUniversities: (totalStats[0]?.topUniversities ?? []).map((item: { _id: string; count: number }) => ({ name: item._id, count: item.count })),
        monthlyRegistrations: Array.from({ length: 6 }, (_, index) => {
          const date = new Date(Date.UTC(year, month - 5 + index, 1));
          const monthKey = date.toISOString().slice(0, 7);
          const item = totalStats[0]?.monthlyRegistrations.find((item: { _id: string }) => item._id === monthKey);
          return { month: monthKey, count: item?.count ?? 0 };
        }),
      },
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
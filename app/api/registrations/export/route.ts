// app/api/registrations/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registrations';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get all registrations
    const registrations = await Registration.find({})
      .sort({ registeredAt: -1 });

    if (registrations.length === 0) {
      return NextResponse.json(
        { error: 'No data to export' },
        { status: 404 }
      );
    }

    // Define CSV headers
    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'University',
      'Graduation Year',
      'Current Location',
      'Registered At',
      'Updated At'
    ];

    // Convert data to CSV rows
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const reg of registrations) {
      const row = [
        `"${reg._id}"`,
        `"${(reg.firstName || '').replace(/"/g, '""')}"`,
        `"${(reg.lastName || '').replace(/"/g, '""')}"`,
        `"${(reg.email || '').replace(/"/g, '""')}"`,
        `"${(reg.phoneNumber || '').replace(/"/g, '""')}"`,
        `"${(reg.university || '').replace(/"/g, '""')}"`,
        `"${(reg.graduationYear || '').replace(/"/g, '""')}"`,
        `"${(reg.currentLocation || '').replace(/"/g, '""')}"`,
        `"${reg.registeredAt ? new Date(reg.registeredAt).toISOString() : ''}"`,
        `"${reg.updatedAt ? new Date(reg.updatedAt).toISOString() : ''}"`
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');
    
    // Set response headers for CSV download
    const filename = `alumni-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Simple query to test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected successfully',
      result 
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
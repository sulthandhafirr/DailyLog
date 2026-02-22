import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { DailyReport } from '@/lib/types';

/**
 * API Route: GET /api/reports
 * Fetches all daily reports, ordered by date descending
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    const { data: reports, error } = await supabase
      .from('daily_reports')
      .select('*')
      .order('report_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reports' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reports: reports as DailyReport[],
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch reports',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { Activity } from '@/lib/types';

/**
 * API Route: POST /api/reports/save
 * Saves or updates a generated report in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, date, activities, fullReport } = body;

    // Validate input
    if (!date || !activities || !fullReport) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract summary from the report (text after "06:00 PM – Summary of today")
    const summaryMatch = fullReport.match(/06:00 PM – Summary of today(.+)/s);
    const summary = summaryMatch ? summaryMatch[1].trim() : null;

    // Parse the date to ISO format for database storage
    let reportDate: string;
    try {
      reportDate = parseDateToISO(date);
      console.log('[Save Report] Date parsed:', date, '→', reportDate);
    } catch (error) {
      console.error('[Save Report] Date parsing failed:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Invalid date format'
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // If ID is provided, update existing report
    if (id) {
      const { data: updatedReport, error: updateError } = await supabase
        .from('daily_reports')
        .update({
          report_date: reportDate,
          activities: activities,
          summary: summary,
          full_report: fullReport,
        })
        .eq('id', id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update report in database' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        reportId: updatedReport?.id,
        message: 'Report updated successfully',
      });
    }

    // Otherwise, create new report
    const { data: savedReport, error: dbError } = await supabase
      .from('daily_reports')
      .insert({
        report_date: reportDate,
        activities: activities,
        summary: summary,
        full_report: fullReport,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to save report to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId: savedReport?.id,
      message: 'Report saved successfully',
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save report',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to parse human-readable date to ISO format (YYYY-MM-DD)
 * Handles formats:
 * - "16 February 2026"
 * - "February 16, 2026"
 * - "Feb 16 2026"
 * - "2026-02-16" (already ISO)
 * 
 * NO TIMEZONE CONVERSION - Pure date parsing
 */
function parseDateToISO(dateString: string): string {
  try {
    // Trim whitespace
    const cleaned = dateString.trim();
    
    // If already in ISO format (YYYY-MM-DD), return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    // Month name mapping (full and abbreviated)
    const monthMap: { [key: string]: number } = {
      'january': 1, 'jan': 1,
      'february': 2, 'feb': 2,
      'march': 3, 'mar': 3,
      'april': 4, 'apr': 4,
      'may': 5,
      'june': 6, 'jun': 6,
      'july': 7, 'jul': 7,
      'august': 8, 'aug': 8,
      'september': 9, 'sep': 9, 'sept': 9,
      'october': 10, 'oct': 10,
      'november': 11, 'nov': 11,
      'december': 12, 'dec': 12
    };

    // Pattern 1: "16 February 2026" or "16 Feb 2026"
    let match = cleaned.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2].toLowerCase();
      const year = parseInt(match[3], 10);
      const month = monthMap[monthName];

      if (month && day >= 1 && day <= 31 && year >= 1900) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    // Pattern 2: "February 16, 2026" or "Feb 16, 2026"
    match = cleaned.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (match) {
      const monthName = match[1].toLowerCase();
      const day = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      const month = monthMap[monthName];

      if (month && day >= 1 && day <= 31 && year >= 1900) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    // Pattern 3: "2026-02-16" (ISO format)
    match = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    // If no pattern matches, throw error instead of silent fallback
    console.error('[Date Parser] Unrecognized format:', cleaned);
    throw new Error(`Invalid date format: "${cleaned}". Expected format: "February 16, 2026" or "16 February 2026"`);

  } catch (error) {
    console.error('[Date Parser] Error:', error);
    throw error;
  }
}


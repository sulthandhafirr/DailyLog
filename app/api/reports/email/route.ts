import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * API Route: POST /api/reports/email
 * Sends a daily report via email
 * 
 * NOTE: This is a demo implementation. In production, you would:
 * - Integrate with an email service (SendGrid, Mailgun, AWS SES, etc.)
 * - Add proper authentication and rate limiting
 * - Use email templates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, email, message } = body;

    // Validate input
    if (!reportId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Fetch the report
    const supabase = getSupabaseClient();
    const { data: report, error: fetchError } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Format the date for display (use UTC to prevent timezone shift)
    const reportDate = new Date(report.report_date + 'T00:00:00Z');
    const formattedDate = reportDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });

    // DEMO: In production, integrate with email service here
    // Example with SendGrid/Mailgun:
    /*
    const emailContent = {
      to: email,
      from: 'noreply@yourapp.com',
      subject: `Daily Report - ${formattedDate}`,
      text: `${message ? message + '\n\n---\n\n' : ''}${report.full_report}`,
      html: generateHtmlEmail(report.full_report, message),
    };
    await emailService.send(emailContent);
    */

    // For demo purposes, just log the email attempt
    console.log('===== EMAIL DEMO =====');
    console.log('To:', email);
    console.log('Subject:', `Daily Report - ${formattedDate}`);
    console.log('Message:', message || '(none)');
    console.log('Report Content:');
    console.log(report.full_report);
    console.log('=====================');

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (demo mode - check server console)',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      },
      { status: 500 }
    );
  }
}

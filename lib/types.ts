/**
 * Type definitions for the Daily Report Generator
 */

export interface Activity {
  time: string;        // Format: "HH:MM AM/PM"
  description: string; // Free text description
}

export interface ReportRequest {
  date: string;          // Format: "Month DD, YYYY" or any readable format
  activities: Activity[];
}

export interface ReportResponse {
  success: boolean;
  report?: string;       // Generated report text
  reportId?: string;     // Database ID of saved report
  error?: string;        // Error message if failed
}

export interface GenerateReportPayload {
  date: string;
  activities: Activity[];
}

// Database types
export interface DailyReport {
  id: string;
  report_date: string;   // ISO date string
  activities: Activity[];
  summary: string | null;
  full_report: string;
  created_at: string;    // ISO timestamp
}

export interface ReportListItem {
  id: string;
  report_date: string;
  created_at: string;
  preview: string;       // First 100 chars of report
}

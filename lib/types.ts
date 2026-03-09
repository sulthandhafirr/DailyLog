export interface Activity {
  time: string;
  description: string;
}

export interface ReportRequest {
  date: string;          // Format: "Month DD, YYYY" or any readable format
  activities: Activity[];
}

export interface ReportResponse {
  success: boolean;
  report?: string;
  reportId?: string;
  error?: string;
}

export interface GenerateReportPayload {
  date: string;
  activities: Activity[];
}

export interface DailyReport {
  id: string;
  report_date: string;
  activities: Activity[];
  summary: string | null;
  full_report: string;
  created_at: string;
}

export interface ReportListItem {
  id: string;
  report_date: string;
  created_at: string;
  preview: string;
}

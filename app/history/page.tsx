'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DailyReport } from '@/lib/types';
import EmailModal from '@/components/EmailModal';

export default function HistoryPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log('[History] Fetching reports...');
      const response = await fetch('/api/reports');
      const data = await response.json();

      if (data.success) {
        console.log('[History] Fetched', data.reports.length, 'reports');
        // Validate that all reports have IDs
        const reportsWithIds = data.reports.filter((r: DailyReport) => {
          if (!r.id) {
            console.error('[History] Report missing ID:', r);
            return false;
          }
          return true;
        });
        setReports(reportsWithIds);
        
        if (reportsWithIds.length !== data.reports.length) {
          console.warn('[History] Some reports were missing IDs and filtered out');
        }
      } else {
        setError(data.error || 'Failed to load reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse ISO date (YYYY-MM-DD) safely without timezone issues
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return dateString;

      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);

      // Create date using UTC to avoid timezone shifts
      const date = new Date(Date.UTC(year, month - 1, day));

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Force UTC to prevent timezone shift
      });
    } catch {
      return dateString;
    }
  };

  const getPreview = (fullReport: string) => {
    const lines = fullReport.split('\n').filter(line => line.trim());
    // Skip title, show first 2-3 activity lines
    return lines.slice(1, 4).join(' | ').substring(0, 150) + '...';
  };

  const handleEdit = (report: DailyReport) => {
    if (!report.id) {
      console.error('[History] Cannot edit report without ID:', report);
      alert('Error: Report ID is missing');
      return;
    }
    
    console.log('[History] Editing report:', report.id);
    
    // Convert ISO date to readable format for form input
    const readableDate = formatDate(report.report_date);
    
    // Store COMPLETE report data in sessionStorage for editing
    sessionStorage.setItem('editReport', JSON.stringify({
      id: report.id,
      date: readableDate, // ✅ Store in readable format for form
      activities: report.activities,
      fullReport: report.full_report, // ✅ Include the full generated report
    }));
    router.push('/');
  };

  const handleDelete = async (reportId: string, reportDate: string) => {
    if (!reportId) {
      console.error('[History] Cannot delete report without ID');
      alert('Error: Report ID is missing');
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete the report for ${formatDate(reportDate)}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    console.log('[History] Deleting report:', reportId);

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        console.log('[History] Report deleted successfully');
        // Remove from local state
        setReports(reports.filter(r => r.id !== reportId));
        alert('✅ Report deleted successfully');
      } else {
        console.error('[History] Delete failed:', data.error);
        alert('Failed to delete report: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleEmailClick = (report: DailyReport) => {
    setSelectedReport(report);
    setEmailModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              ← Back to Generator
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              Report History
            </h1>
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="p-12 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-slate-400">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && reports.length === 0 && (
          <div className="p-12 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              No reports found. Generate your first report to see it here!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
            >
              Create Report
            </Link>
          </div>
        )}

        {/* Reports List */}
        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              if (!report.id) {
                console.error('[History] Skipping report without ID:', report);
                return null;
              }
              
              return (
                <div 
                  key={report.id} 
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-1">
                        {formatDate(report.report_date)}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Created: {new Date(report.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href={`/history/${report.id}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      View Full Report
                    </Link>
                    <button
                      onClick={() => handleEdit(report)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleEmailClick(report)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Send Email
                    </button>
                    <a
                      href={`/api/export/docx/${report.id}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                      download
                    >
                      Export .docx
                    </a>
                    <a
                      href={`/api/export/pdf/${report.id}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                      download
                    >
                      Export PDF
                    </a>
                    <button
                      onClick={() => handleDelete(report.id, report.report_date)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Email Modal */}
        {selectedReport && (
          <EmailModal
            isOpen={emailModalOpen}
            onClose={() => {
              setEmailModalOpen(false);
              setSelectedReport(null);
            }}
            reportId={selectedReport.id}
            reportDate={formatDate(selectedReport.report_date)}
          />
        )}
      </div>
    </main>
  );
}

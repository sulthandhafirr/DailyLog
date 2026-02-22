'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DailyReport } from '@/lib/types';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      console.log('[Report Detail] Fetching report:', id);
      fetchReport();
    } else {
      console.error('[Report Detail] No ID provided in URL params');
      setError('Report ID is missing from URL');
      setLoading(false);
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      console.log('[Report Detail] Fetching from API:', `/api/reports/${id}`);
      const response = await fetch(`/api/reports/${id}`);
      const data = await response.json();

      if (data.success) {
        console.log('[Report Detail] Report fetched successfully');
        setReport(data.report);
      } else {
        console.error('[Report Detail] API returned error:', data.error);
        setError(data.error || 'Report not found');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to load report');
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

  const copyToClipboard = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.full_report);
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy report');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">Loading report...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error || 'Report not found'}
            </p>
          </div>
          <Link 
            href="/history" 
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            ← Back to History
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
            <Link 
              href="/history" 
              className="inline-flex items-center justify-center sm:justify-start px-4 py-2 sm:px-0 sm:py-0 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 sm:bg-transparent rounded-md sm:rounded-none order-2 sm:order-1"
            >
              ← Back to History
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center order-1 sm:order-2">
              Daily Report
            </h1>
            <div className="hidden sm:block w-32"></div> {/* Spacer for center alignment on desktop */}
          </div>
          <p className="text-center text-base sm:text-lg text-gray-600 dark:text-slate-400">
            {formatDate(report.report_date)}
          </p>
        </header>

        {/* Report Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100">
              Report Details
            </h2>
          </div>

          {/* Report Content */}
          <div className="p-4 sm:p-6">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed text-gray-900 dark:text-slate-100 whitespace-pre-wrap break-words">
              {report.full_report}
            </pre>
          </div>

          {/* Metadata */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-3 sm:mb-4">
              <p>
                <strong className="text-gray-900 dark:text-slate-100">Created:</strong>{' '}
                {new Date(report.created_at).toLocaleString()}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-slate-100">Activities:</strong>{' '}
                {report.activities.length}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <button 
                onClick={copyToClipboard} 
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Copy to Clipboard
              </button>
              <a
                href={`/api/export/docx/${report.id}`}
                className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                download
              >
                Export .docx
              </a>
              <a
                href={`/api/export/pdf/${report.id}`}
                className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                download
              >
                Export PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

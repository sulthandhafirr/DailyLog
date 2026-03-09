'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileEdit, X } from 'lucide-react';
import ReportForm from '@/components/ReportForm';
import ReportDisplay from '@/components/ReportDisplay';
import { Activity, ReportResponse } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [report, setReport] = useState<string>('');
  const [reportId, setReportId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [editData, setEditData] = useState<{ id: string; date: string; activities: Activity[]; fullReport?: string } | null>(null);

  useEffect(() => {
    const editReportData = sessionStorage.getItem('editReport');
    if (editReportData) {
      try {
        const data = JSON.parse(editReportData);
        setEditData(data);
        setReportId(data.id);
        setDate(data.date);
        setActivities(data.activities);
        if (data.fullReport) {
          setReport(data.fullReport);
        }
        sessionStorage.removeItem('editReport');
      } catch (err) {
        console.error('Error parsing edit data:', err);
        setError('Failed to load report for editing');
      }
    }
  }, []);

  const handleGenerateReport = async (reportDate: string, reportActivities: Activity[]) => {
    setIsGenerating(true);
    setError('');
    setReport('');
    setDate(reportDate);
    setActivities(reportActivities);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: reportDate, activities: reportActivities }),
      });

      const data: ReportResponse = await response.json();

      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveReport = async () => {
    if (!report || !date || !activities.length) {
      setError('No report to save');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/reports/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: reportId || undefined, // Include ID if editing
          date, 
          activities, 
          fullReport: report 
        }),
      });

      const data = await response.json();

      if (data.success && data.reportId) {
        const message = reportId ? 'Report updated successfully!' : 'Report saved to history!';
        alert(message);
        router.push('/history');
      } else {
        setError(data.error || 'Failed to save report');
      }
    } catch (err) {
      console.error('Error saving report:', err);
      setError('Failed to save report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExitEditMode = () => {
    const confirmed = window.confirm('Exit edit mode? Any unsaved changes will be lost.');
    if (confirmed) {
      setReportId('');
      setEditData(null);
      setReport('');
      setDate('');
      setActivities([{ time: '', description: '' }]);
      setError('');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 mb-4">
            <div className="order-2 sm:order-1"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 text-center order-1 sm:order-2">
              Daily Report Generator
            </h1>
            <Link 
              href="/history" 
              className="inline-flex items-center gap-2 justify-center sm:justify-end px-4 py-2 sm:px-0 sm:py-0 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-md sm:rounded-none order-3"
            >
              View History <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {reportId && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-200">
                <FileEdit className="w-4 h-4" /> Edit Mode: Modifying existing report
              </span>
              <button 
                onClick={handleExitEditMode}
                className="flex items-center gap-1 justify-center w-full sm:w-auto px-3 py-2 sm:py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
                title="Exit edit mode and create new report"
              >
                <X className="w-3 h-3" /> Exit Edit Mode
              </button>
            </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Form */}
          <div className="order-1">
            <ReportForm
              key={reportId || 'new'}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGenerating}
              initialData={editData || undefined}
            />
          </div>

          {/* Right: Output */}
          <div className="order-2">
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {report && (
              <ReportDisplay 
                report={report} 
                reportId={reportId}
                onSave={handleSaveReport}
                isSaving={isSaving}
              />
            )}

            {!report && !error && (
              <div className="p-6 sm:p-8 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
                  Fill in the form and click "Generate Report" to see your professional daily report here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

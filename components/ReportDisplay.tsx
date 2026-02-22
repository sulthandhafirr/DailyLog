'use client';

interface ReportDisplayProps {
  report: string;
  reportId?: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function ReportDisplay({ report, reportId, onSave, isSaving }: ReportDisplayProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy report');
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          Generated Report
        </h2>
      </div>

      {/* Report Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <pre className="font-mono text-sm leading-relaxed text-gray-900 dark:text-slate-100 whitespace-pre-wrap break-words">
          {report}
        </pre>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-2 mb-4">
          {onSave && (
            <button 
              onClick={onSave} 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  💾 {reportId ? 'Update Report' : 'Save to History'}
                </span>
              )}
            </button>
          )}
          
          <button 
            onClick={copyToClipboard} 
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Copy to Clipboard
          </button>
          
          <button 
            onClick={downloadAsText} 
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Download .txt
          </button>
          
          {reportId && (
            <>
              <a
                href={`/api/export/docx/${reportId}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors inline-flex items-center"
                download
              >
                Export .docx
              </a>
              <a
                href={`/api/export/pdf/${reportId}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors inline-flex items-center"
                download
              >
                Export PDF
              </a>
            </>
          )}
        </div>

        {/* Info Message */}
        <div className="text-sm text-gray-600 dark:text-slate-400">
          {reportId ? (
            <p>
              <strong className="text-green-600 dark:text-green-400">✅ Saved to History!</strong>{' '}
              This report is available in your history and can be exported as Word or PDF.
            </p>
          ) : (
            <p>
              <strong className="text-blue-600 dark:text-blue-400">💡 Tip:</strong>{' '}
              Click "Save to History" to enable Word and PDF exports.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

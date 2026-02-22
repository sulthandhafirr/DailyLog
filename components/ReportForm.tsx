'use client';

import { useState, useRef, useEffect } from 'react';
import { Activity } from '@/lib/types';
import TimeInput, { TimeInputRef } from './TimeInput';

interface ReportFormProps {
  onGenerateReport: (date: string, activities: Activity[]) => void;
  isGenerating: boolean;
  initialData?: {
    date: string;
    activities: Activity[];
    fullReport?: string; // Optional, not used by form but may be in parent data
  };
}

export default function ReportForm({ onGenerateReport, isGenerating, initialData }: ReportFormProps) {
  const [date, setDate] = useState<string>(initialData?.date || '');
  const [activities, setActivities] = useState<Activity[]>(
    initialData?.activities || [{ time: '', description: '' }]
  );

  // Refs for focus management
  const timeInputRefs = useRef<(TimeInputRef | null)[]>([]);
  const descriptionInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      console.log('[ReportForm] Loading initial data:', initialData);
      setDate(initialData.date);
      setActivities(initialData.activities);
    } else {
      // ✅ Reset form when initialData is cleared (exit edit mode)
      console.log('[ReportForm] Resetting form (no initial data)');
      setDate('');
      setActivities([{ time: '', description: '' }]);
    }
  }, [initialData]);

  // Update refs array when activities change
  useEffect(() => {
    timeInputRefs.current = timeInputRefs.current.slice(0, activities.length);
    descriptionInputRefs.current = descriptionInputRefs.current.slice(0, activities.length);
  }, [activities.length]);

  const addActivity = () => {
    setActivities([...activities, { time: '', description: '' }]);
    // Focus on new activity time input after render
    setTimeout(() => {
      timeInputRefs.current[activities.length]?.focus();
    }, 0);
  };

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const updateActivity = (index: number, field: keyof Activity, value: string) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Filter out empty activities
    const validActivities = activities.filter(
      (a) => a.time.trim() !== '' && a.description.trim() !== ''
    );

    if (!date.trim()) {
      alert('Please enter a date');
      return;
    }

    if (validActivities.length === 0) {
      alert('Please add at least one activity with time and description');
      return;
    }

    onGenerateReport(date, validActivities);
  };

  // Handle Enter key on Time input → focus Description
  const handleTimeEnter = (index: number) => {
    descriptionInputRefs.current[index]?.focus();
  };

  // Handle Enter key on Description → add new activity row
  const handleDescriptionEnter = (index: number) => {
    // Only add if current description is not empty
    if (activities[index].description.trim()) {
      addActivity();
    }
  };

  // Handle Shift+Enter anywhere → submit form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-6 shadow-sm">
      {/* Date Input */}
      <div className="mb-4 sm:mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Date
        </label>
        <input
          id="date"
          type="text"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isGenerating}
          className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        />
      </div>

      {/* Activities Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            Activities
          </h3>
          <button
            type="button"
            onClick={addActivity}
            disabled={isGenerating}
            className="w-full sm:w-auto px-3 py-2 sm:py-1.5 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            + Add Activity
          </button>
        </div>

        <div className="space-y-3 sm:space-y-2">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              {/* Time Input - Full width on mobile, fixed width on desktop */}
              <div className="w-full sm:w-auto">
                <TimeInput
                  ref={(el) => {
                    timeInputRefs.current[index] = el;
                  }}
                  value={activity.time}
                  onChange={(value) => updateActivity(index, 'time', value)}
                  onEnter={() => handleTimeEnter(index)}
                  disabled={isGenerating}
                  placeholder="Time"
                />
              </div>
              
              {/* Description Input - Full width */}
              <input
                ref={(el) => {
                  descriptionInputRefs.current[index] = el;
                }}
                type="text"
                placeholder="Activity description"
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleDescriptionEnter(index);
                  }
                }}
                disabled={isGenerating}
                className="flex-1 px-3 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              
              {/* Remove Button - Touch-friendly on mobile */}
              {activities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-3 py-2.5 sm:p-2 text-sm sm:text-base text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 sm:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 sm:gap-0"
                  title="Remove activity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sm:hidden font-medium">Remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Report'
        )}
      </button>
      
      <p className="mt-3 text-xs text-gray-500 dark:text-slate-400 text-center hidden sm:block">
        Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded">Shift + Enter</kbd> to generate
      </p>
    </form>
  );
}

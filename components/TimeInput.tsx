'use client';

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

interface TimeInputProps {
  value: string; // Full format: "HH:MM AM/PM"
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface TimeInputRef {
  focus: () => void;
}

/**
 * Smart time input component with:
 * - Auto-formatting (0225 → 02:25, 930 → 09:30)
 * - AM/PM selection
 * - Keyboard navigation (Enter key support)
 */
const TimeInput = forwardRef<TimeInputRef, TimeInputProps>(
  ({ value, onChange, onEnter, disabled, placeholder = 'e.g., 930' }, ref) => {
    // Parse existing value
    const parseExistingValue = (val: string): { time: string; period: string } => {
      if (!val) return { time: '', period: 'AM' };
      
      const match = val.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
      if (match) {
        return { time: match[1], period: match[2].toUpperCase() };
      }
      return { time: '', period: 'AM' };
    };

    const { time: initialTime, period: initialPeriod } = parseExistingValue(value);
    const [timeValue, setTimeValue] = useState(initialTime);
    const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod as 'AM' | 'PM');
    const [isTyping, setIsTyping] = useState(false);
    
    const timeInputRef = useRef<HTMLInputElement>(null);
    const periodInputRef = useRef<HTMLSelectElement>(null);

    // ✅ Sync local state when value prop changes (for edit mode) but not while typing
    useEffect(() => {
      if (!isTyping) {
        const parsed = parseExistingValue(value);
        setTimeValue(parsed.time);
        setPeriod(parsed.period as 'AM' | 'PM');
      }
    }, [value, isTyping]);

    // Expose focus method to parent
    useImperativeHandle(ref, () => ({
      focus: () => {
        timeInputRef.current?.focus();
      },
    }));

    /**
     * Format numeric input to HH:MM
     * Examples:
     * - 930 → 09:30
     * - 1430 → 14:30
     * - 0225 → 02:25
     * - 9 → 09:00
     * - 12 → 12:00
     */
    const formatTime = (input: string): string => {
      // Remove all non-numeric characters
      const numbers = input.replace(/\D/g, '');
      
      if (!numbers) return '';
      
      let hours = '';
      let minutes = '';

      if (numbers.length === 1 || numbers.length === 2) {
        // 9 → 09:00, 12 → 12:00
        hours = numbers.padStart(2, '0');
        minutes = '00';
      } else if (numbers.length === 3) {
        // 930 → 09:30
        hours = numbers.substring(0, 1).padStart(2, '0');
        minutes = numbers.substring(1, 3);
      } else {
        // 0225 → 02:25, 1430 → 14:30
        hours = numbers.substring(0, 2);
        minutes = numbers.substring(2, 4);
      }

      // Validate hours (00-23)
      let hoursNum = parseInt(hours, 10);
      if (hoursNum > 23) hoursNum = 23;
      hours = hoursNum.toString().padStart(2, '0');

      // Validate minutes (00-59)
      let minutesNum = parseInt(minutes, 10);
      if (minutesNum > 59) minutesNum = 59;
      minutes = minutesNum.toString().padStart(2, '0');

      return `${hours}:${minutes}`;
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      
      // Allow only numbers and colon, but be more permissive during typing
      const sanitized = input.replace(/[^\d:]/g, '');
      
      setIsTyping(true);
      setTimeValue(sanitized);
      // Update parent immediately with current value
      onChange(sanitized ? `${sanitized} ${period}` : '');
    };

    const handleTimeBlur = () => {
      setIsTyping(false);
      // Format on blur
      if (timeValue) {
        const formatted = formatTime(timeValue);
        setTimeValue(formatted);
        // Update parent with formatted value
        onChange(`${formatted} ${period}`);
      }
    };

    const handleTimeFocus = () => {
      setIsTyping(true);
    };

    const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsTyping(false);
        // Format immediately
        if (timeValue) {
          const formatted = formatTime(timeValue);
          setTimeValue(formatted);
          // Update parent with formatted value
          onChange(`${formatted} ${period}`);
        }
        // Move to period selector or trigger onEnter
        if (onEnter) {
          onEnter();
        } else {
          periodInputRef.current?.focus();
        }
      }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPeriod = e.target.value as 'AM' | 'PM';
      setPeriod(newPeriod);
      // Update parent immediately
      if (timeValue) {
        onChange(`${timeValue} ${newPeriod}`);
      }
    };

    const handlePeriodKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
      if (e.key === 'Enter' && onEnter) {
        e.preventDefault();
        onEnter();
      }
    };

    return (
      <div className="flex items-center gap-1 w-full sm:w-auto">
        <input
          ref={timeInputRef}
          type="text"
          inputMode="numeric"
          value={timeValue}
          onChange={handleTimeChange}
          onFocus={handleTimeFocus}
          onBlur={handleTimeBlur}
          onKeyDown={handleTimeKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 sm:flex-none sm:w-24 px-3 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-center font-mono placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          maxLength={5}
        />
        <select
          ref={periodInputRef}
          value={period}
          onChange={handlePeriodChange}
          onKeyDown={handlePeriodKeyDown}
          disabled={disabled}
          className="w-20 sm:w-16 px-2 py-2.5 sm:py-2 text-base sm:text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;

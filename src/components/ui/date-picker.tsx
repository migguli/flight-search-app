import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  id?: string;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  label,
  error,
  className,
  minDate,
  maxDate,
  placeholderText = 'Select date...',
  id,
  required = false,
  ariaLabel,
  ariaDescribedBy,
}) => {
  // Generate unique IDs for accessibility
  const uniqueId = id || `date-picker-${Math.random().toString(36).substring(2, 9)}`;
  const errorId = `${uniqueId}-error`;
  const labelId = `${uniqueId}-label`;

  return (
    <div className="w-full">
      {label && (
        <label 
          id={labelId}
          htmlFor={uniqueId} 
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}{required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholderText}
          dateFormat="MMMM d, yyyy"
          id={uniqueId}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : ariaDescribedBy}
          aria-label={ariaLabel || label}
          // Improve keyboard navigation
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // Improve accessibility with proper roles
          popperClassName="datepicker-popper"
          // Ensure calendar works with screen readers
          calendarClassName="aria-calendar"
        />
        <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" aria-hidden="true" />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}; 
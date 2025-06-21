import React from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "선택해주세요",
  value,
  options,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-toss-gray-700">
          {label}
          {required && <span className="text-toss-red ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-3 rounded-xl border border-toss-gray-200 bg-white",
          "text-toss-gray-900 placeholder-toss-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-toss-blue focus:border-transparent",
          "disabled:bg-toss-gray-50 disabled:text-toss-gray-400 disabled:cursor-not-allowed",
          "transition-colors duration-200",
          error && "border-toss-red focus:ring-toss-red",
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {(error || helperText) && (
        <div className="text-sm">
          {error ? (
            <span className="text-toss-red">{error}</span>
          ) : (
            helperText && <span className="text-toss-gray-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
}; 
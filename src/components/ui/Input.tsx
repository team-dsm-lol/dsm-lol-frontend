 import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-toss-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 border rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-toss-blue focus:border-transparent',
            'placeholder:text-toss-gray-400',
            error
              ? 'border-toss-red focus:ring-toss-red'
              : 'border-toss-gray-300 hover:border-toss-gray-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-toss-red">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-toss-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 
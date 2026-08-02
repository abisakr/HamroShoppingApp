import React, { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  required?: boolean
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, helperText, icon, required, className, ...props },
    ref
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-2 border rounded-lg outline-none transition
              ${icon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
              }
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-600">{helperText}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput

// Textarea
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, required, className, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-2 border rounded-lg outline-none transition resize-none
            ${
              error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-600">{helperText}</p>}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

// Select
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  required?: boolean
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, required, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg outline-none transition appearance-none
            ${
              error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

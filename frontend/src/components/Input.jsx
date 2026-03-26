import React from 'react'

export default function Input({ 
  label, 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  error,
  required = false,
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 rounded-lg
          border-2 transition-colors
          bg-white dark:bg-gray-700
          text-gray-800 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none
          ${error 
            ? 'border-red-500 focus:border-red-600' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
          }
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-white dark:bg-gray-800
      rounded-lg shadow-md dark:shadow-lg
      p-6
      border border-gray-200 dark:border-gray-700
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  )
}

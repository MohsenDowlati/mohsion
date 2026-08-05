"use client"

import React from "react"
import clsx from "clsx"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-gray-300"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={clsx(
          "w-full px-4 py-2 rounded-lg bg-gray-900 border outline-none transition",
          error
            ? "border-red-500 focus:border-red-400"
            : "border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400",
          className
        )}
        {...props}
      />

      {error && (
        <span className="text-xs text-red-400">
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className="text-xs text-gray-500">
          {helperText}
        </span>
      )}
    </div>
  )
}

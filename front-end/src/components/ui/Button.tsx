"use client"

import React from "react"
import clsx from "clsx"

type Variant = "primary" | "secondary" | "danger" | "ghost"
type Size = "sm" | "md" | "lg"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)] hover:shadow-[0_0_18px_rgba(59,130,246,0.7)]",
    secondary:
      "bg-slate-900 border border-blue-500/30 text-blue-400 hover:border-blue-400 hover:bg-slate-800",
    danger:
      "bg-red-500 text-white hover:bg-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    ghost:
      "text-blue-400 hover:bg-blue-500/10"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
          Loading...
        </span>
      ) : children}
    </button>
  )
}

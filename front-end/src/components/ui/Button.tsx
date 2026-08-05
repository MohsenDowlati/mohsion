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
    "inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    secondary:
      "bg-gray-900 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400",
    danger:
      "bg-red-500 text-white hover:bg-red-400",
    ghost:
      "text-cyan-400 hover:bg-cyan-500/10"
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
      {loading ? "Loading..." : children}
    </button>
  )
}

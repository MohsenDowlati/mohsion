"use client"

import Link from "next/link"

type Props = {
  size?: number
  withText?: boolean
  href?: string | null
}

export default function Logo({ size = 36, withText = true, href = "/workspace" }: Props) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="url(#mohsion-grad)" />
      <path
        d="M14 33V16l10 9 10-9v17"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="mohsion-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  )

  const content = (
    <div className="flex items-center gap-2.5">
      {mark}
      {withText && (
        <span className="text-xl font-bold tracking-tight text-blue-400">
          mohsion
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}

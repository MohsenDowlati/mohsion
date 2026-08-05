"use client"

import React, { useEffect } from "react"
import clsx from "clsx"

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className
}: ModalProps) {

  // close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      document.addEventListener("keydown", handleEsc)
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* modal */}
      <div
        className={clsx(
          "relative w-full max-w-lg rounded-xl bg-gray-950 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-6",
          className
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-cyan-400">
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* content */}
        <div>
          {children}
        </div>
      </div>

    </div>
  )
}

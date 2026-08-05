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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 modal-backdrop animate-fade-in"
      />

      <div
        className={clsx(
          "relative w-full max-w-lg rounded-xl bg-slate-950 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] p-6 animate-scale-in",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-blue-400">
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg transition-colors hover:rotate-90 duration-200"
          >
            ✕
          </button>
        </div>

        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  )
}

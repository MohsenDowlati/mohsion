"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { removeToast, ToastType } from "@/features/toasts/toastSlice"

const config: Record<
  ToastType,
  { border: string; icon: string; iconColor: string; accent: string; glow: string; duration: number }
> = {
  success: {
    border: "border-blue-500",
    icon: "✓",
    iconColor: "text-blue-400",
    accent: "bg-blue-500",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    duration: 3500,
  },
  error: {
    border: "border-red-500",
    icon: "✕",
    iconColor: "text-red-400",
    accent: "bg-red-500",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    duration: 5000,
  },
  warning: {
    border: "border-amber-500",
    icon: "!",
    iconColor: "text-amber-400",
    accent: "bg-amber-500",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    duration: 4500,
  },
  info: {
    border: "border-slate-600",
    icon: "ℹ",
    iconColor: "text-slate-300",
    accent: "bg-slate-500",
    glow: "shadow-lg",
    duration: 3500,
  },
}

export default function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toasts.toasts)
  const dispatch = useDispatch()

  useEffect(() => {
    const timers = toasts.map((t) => {
      const dur = t.duration ?? config[t.type].duration
      return setTimeout(() => dispatch(removeToast(t.id)), dur)
    })
    return () => timers.forEach(clearTimeout)
  }, [toasts, dispatch])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-[100] flex flex-col gap-2 sm:max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const c = config[toast.type]
        const dur = toast.duration ?? c.duration

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-lg border ${c.border} bg-slate-900 ${c.glow} animate-slide-in-right`}
          >
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${c.accent}/20 ${c.iconColor} font-bold text-sm`}
            >
              {c.icon}
            </span>

            <span className="text-sm text-slate-200 flex-1 break-words">{toast.message}</span>

            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-slate-500 hover:text-slate-300 text-sm shrink-0 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>

            <span
              className={`absolute bottom-0 left-0 h-0.5 ${c.accent}`}
              style={{ animation: `shrinkBar ${dur}ms linear forwards` }}
            />
          </div>
        )
      })}
    </div>
  )
}

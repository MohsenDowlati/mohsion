"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { removeToast } from "@/features/toasts/toastSlice"

export default function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toasts.toasts)
  const dispatch = useDispatch()

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => dispatch(removeToast(t.id)), 3500)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts, dispatch])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const colors = {
          success: "border-blue-500 bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
          error: "border-red-500 bg-slate-900 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
          info: "border-slate-600 bg-slate-900 shadow-lg",
        }
        const icons = {
          success: "✓",
          error: "✕",
          info: "ℹ",
        }
        const iconColors = {
          success: "text-blue-400",
          error: "text-red-400",
          info: "text-slate-400",
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[toast.type]} animate-slide-in-right`}
          >
            <span className={`text-lg font-bold ${iconColors[toast.type]}`}>
              {icons[toast.type]}
            </span>
            <span className="text-sm text-slate-200">{toast.message}</span>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="ml-auto text-slate-500 hover:text-slate-300 text-sm"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}

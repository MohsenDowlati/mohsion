"use client"

import { TaskPriority } from "@/types/task"
import { useState, useRef, useEffect } from "react"

type Props = {
  onSelect: (val: TaskPriority) => void
  value?: TaskPriority
}

export default function Dropdown({ onSelect, value = "low" }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<TaskPriority>(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const options: { val: TaskPriority; label: string; color: string }[] = [
    { val: "low", label: "Low", color: "text-emerald-400" },
    { val: "medium", label: "Medium", color: "text-amber-400" },
    { val: "high", label: "High", color: "text-red-400" },
  ]

  const current = options.find((o) => o.val === selected) ?? options[0]

  const select = (val: TaskPriority) => {
    setSelected(val)
    onSelect(val)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-blue-400/40
        hover:bg-slate-700 hover:border-blue-400
        transition-all duration-200 flex items-center justify-between"
      >
        <span className={current.color}>{current.label}</span>
        <span className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 left-0 mt-2 rounded-lg bg-slate-900 border border-blue-400/30 shadow-xl overflow-hidden animate-scale-in z-50">
          {options.map((opt) => (
            <button
              key={opt.val}
              className={`block w-full text-left px-4 py-2 text-sm transition-all duration-150 ${
                selected === opt.val
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
              onClick={() => select(opt.val)}
            >
              <span className={opt.color}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

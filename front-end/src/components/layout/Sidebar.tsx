"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

type Props = {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  const workspaces = useSelector(
    (state: RootState) => state.workspaces.workspaces
  )

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-slate-950 border-r border-blue-500/20 z-50 transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-blue-400 text-lg mb-6 font-semibold">
            Workspaces
          </h2>

          <div className="flex flex-col gap-2">
            {workspaces.length === 0 && (
              <p className="text-slate-600 text-sm">No workspaces yet.</p>
            )}

            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspace/${ws.id}`}
                className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-transparent hover:border-blue-500/40 text-slate-300 hover:text-blue-300 transition-all duration-200 text-sm"
                onClick={onClose}
              >
                {ws.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

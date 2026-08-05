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
      {/* overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-cyan-500/20 z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">

          <h2 className="text-cyan-400 text-lg mb-6">
            Workspaces
          </h2>

          <div className="flex flex-col gap-3">
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspace/${ws.id}`}
                className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 border border-transparent hover:border-cyan-400 transition"
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

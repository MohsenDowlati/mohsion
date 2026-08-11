"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { logout } from "@/features/auth/authSlice"
import { addToast } from "@/features/toasts/toastSlice"
import { STORAGE_KEYS } from "@/utils/constants"
import { socketClient } from "@/services/websocket/socketClient"
import { frontendCache } from "@/cache/storage"
import { clearWorkspaces } from "@/features/workspaces/workspaceSlice"
import { clearLists } from "@/features/lists/listSlice"
import { clearTasks } from "@/features/tasks/taskSlice"

type Props = {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: Props) {
  const router = useRouter()
  const dispatch = useDispatch()
  const pathname = usePathname()

  const user = useSelector((state: RootState) => state.auth.user)

  const handleLogout = () => {
    if (user) frontendCache.clearUser(user.id)
    dispatch(logout())
    dispatch(clearWorkspaces())
    dispatch(clearLists())
    dispatch(clearTasks())
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem("auth")
    socketClient.disconnect()
    dispatch(addToast({ message: "Signed out successfully", type: "info" }))
    router.push("/auth/signin")
  }

  if (pathname.startsWith("/auth")) return null

  return (
    <nav className="w-full h-16 bg-slate-950 border-b border-blue-500/20 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="text-blue-400 text-xl hover:text-blue-300 transition-colors"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <Link
          href="/workspace"
          className="text-lg sm:text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          mohsion
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {user && (
          <span className="text-slate-300 text-sm hidden sm:inline">
            Welcome, {user.name}!
          </span>
        )}

        <button
          onClick={handleLogout}
          className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all active:scale-95 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

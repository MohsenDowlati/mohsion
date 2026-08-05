"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { logout } from "@/features/auth/authSlice"

type Props = {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: Props) {
  const router = useRouter()
  const dispatch = useDispatch()
  const pathname = usePathname()

  const user = useSelector((state: RootState) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/auth/signin")
  }

  return (
    <nav className={`w-full h-16 bg-black border-b border-cyan-500/20 flex items-center justify-between px-6 ${pathname.startsWith("/auth")? 'hidden':''}`}>

      <div className="flex items-center gap-4">

        {/* menu button */}
        <button
          onClick={onMenuClick}
          className="text-cyan-400 text-xl"
        >
          ☰
        </button>

        <Link
          href="/workspace"
          className="text-xl font-semibold text-cyan-400"
        >
          RealtimeTodo
        </Link>

      </div>

      <div className="flex items-center gap-6">

        {user && (
          <span className="text-gray-300 text-sm">
            welcome {user.name}!
          </span>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-sm ml-6"
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

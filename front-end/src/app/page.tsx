"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function HomePage() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      router.replace("/workspace")
    } else {
      router.replace("/auth/signin")
    }
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      Loading...
    </div>
  )
}

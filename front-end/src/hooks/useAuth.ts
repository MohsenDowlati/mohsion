"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { setUser, setToken, logout} from "@/features/auth/authSlice"
import authApi from "@/services/api/authApi"
import { useRouter } from "next/navigation"

export default function useAuth() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user, token } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(false)

  // Restore session on first mount
  useEffect(() => {
    const saved = localStorage.getItem("auth")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.user && parsed.token) {
          dispatch(setUser(parsed.user))
          dispatch(setToken(parsed.token))
        }
      } catch {
        localStorage.removeItem("auth")
      }
    }
  }, [dispatch])

  // Sync Redux → localStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ user, token })
      )
    } else {
      localStorage.removeItem("auth")
    }
  }, [user, token])

  // Sign in
  const signIn = useCallback(
    async (name: string, password: string) => {
      setLoading(true)
      try {
        const res = await authApi.signIn(name, password)

        dispatch(setUser(res.user))
        dispatch(setToken(res.token))
        localStorage.setItem("auth", JSON.stringify(res))

        return res
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  // Sign up then auto-login
  const signUp = useCallback(
    async (name: string, password: string) => {
      setLoading(true)
      try {
        const res = await authApi.signUp(name, password)

        dispatch(setUser(res.user))
        dispatch(setToken(res.token))
        localStorage.setItem("auth", JSON.stringify(res))

        return res
      } finally {
        setLoading(false)
      }
    },
    [dispatch]
  )

  // Logout
  const signOut = useCallback(() => {
    dispatch(logout())
    localStorage.removeItem("auth")
    router.push("/auth/signin")
  }, [dispatch, router])

  // Redirect helpers
  const requireAuth = useCallback(() => {
    if (!token) router.push("/auth/signin")
  }, [token, router])

  const redirectIfAuthenticated = useCallback(() => {
    if (token) router.push("/workspace")
  }, [token, router])

  return {
    user,
    token,
    loading,
    authenticated: Boolean(token),
    signIn,
    signUp,
    signOut,
    requireAuth,
    redirectIfAuthenticated
  }
}

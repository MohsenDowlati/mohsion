"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { setUser, setToken, logout} from "@/features/auth/authSlice"
import authApi from "@/services/api/authApi"
import { useRouter } from "next/navigation"
import { STORAGE_KEYS } from "@/utils/constants"
import { getLocalStorage } from "@/utils/helper"
import { frontendCache } from "@/cache/storage"
import { socketClient } from "@/services/websocket/socketClient"
import { clearWorkspaces } from "@/features/workspaces/workspaceSlice"
import { clearLists } from "@/features/lists/listSlice"
import { clearTasks } from "@/features/tasks/taskSlice"

export default function useAuth() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user, token } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Restore session on first mount
  useEffect(() => {
    const restore = async () => {
      const saved = localStorage.getItem("auth")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.user && parsed.token) {
            dispatch(setUser(parsed.user))
            dispatch(setToken(parsed.token))
            return
          }
        } catch {
          localStorage.removeItem("auth")
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
        }
      }

      const savedToken = getLocalStorage<string | null>(STORAGE_KEYS.TOKEN, null)
      if (!savedToken) return
      try {
        const savedUser = await authApi.me(savedToken)
        dispatch(setUser(savedUser))
        dispatch(setToken(savedToken))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
      }
    }

    void restore().finally(() => setInitialized(true))
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
    if (user) frontendCache.clearUser(user.id)
    socketClient.disconnect()
    dispatch(logout())
    dispatch(clearWorkspaces())
    dispatch(clearLists())
    dispatch(clearTasks())
    localStorage.removeItem("auth")
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    router.push("/auth/signin")
  }, [dispatch, router, user])

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
    initialized,
    authenticated: Boolean(token),
    signIn,
    signUp,
    signOut,
    requireAuth,
    redirectIfAuthenticated
  }
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import authApi from "@/services/api/authApi"
import { useDispatch } from "react-redux"
import { setUser, setToken } from "@/features/auth/authSlice"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { setLocalStorage } from "@/utils/helper"
import { STORAGE_KEYS } from "@/utils/constants"

export default function SignInPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await authApi.signIn(name, password)
      dispatch(setUser(data.user))
      dispatch(setToken(data.token))
      setLocalStorage(STORAGE_KEYS.TOKEN,data.token)
      router.push("/workspace")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <h1 className="text-3xl font-semibold text-center text-cyan-400 mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition mt-6"
          >
            Login
          </Button>
        </form>        
        <p className="text-center text-gray-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="text-cyan-400 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

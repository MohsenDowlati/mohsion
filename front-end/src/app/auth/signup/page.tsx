"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import authApi from "@/services/api/authApi"
import { setUser, setToken } from "@/features/auth/authSlice"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { setLocalStorage } from "@/utils/helper"
import { STORAGE_KEYS } from "@/utils/constants"

export default function SignUpPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)
      const data = await authApi.signUp(name, password)

      dispatch(setUser(data.user))
      dispatch(setToken(data.token))
      setLocalStorage(STORAGE_KEYS.TOKEN,data.token)

      router.push("/workspace")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign up"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        
        <h1 className="text-3xl font-semibold text-center text-cyan-400 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
          />

          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
          />
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}
          <Button type="submit" loading={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition mt-6">Sign Up</Button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-cyan-400 hover:underline"
          >
            Sign In
          </a>
        </p>

      </div>
    </div>
  )
}

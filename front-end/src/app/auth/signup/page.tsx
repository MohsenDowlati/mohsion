"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import authApi from "@/services/api/authApi"
import { setUser, setToken } from "@/features/auth/authSlice"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Logo from "@/components/ui/Logo"
import { setLocalStorage } from "@/utils/helper"
import { STORAGE_KEYS } from "@/utils/constants"
import { addToast } from "@/features/toasts/toastSlice"

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
      setLocalStorage(STORAGE_KEYS.TOKEN, data.token)
      dispatch(addToast({ message: "Account created!", type: "success" }))

      router.push("/workspace")
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Unable to sign up"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="mb-8 animate-fade-in-down">
        <Logo href={null as unknown as string} size={56} />
      </div>

      <div className="w-full max-w-md p-8 bg-slate-900 border border-blue-500/30 rounded-xl shadow-[0_0_24px_rgba(59,130,246,0.15)] animate-scale-in">
        <h1 className="text-3xl font-semibold text-center text-blue-400 mb-2">Create Account</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Join mohsion and start collaborating</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Name"
            placeholder="Enter your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />

          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />

          {error && <p className="text-sm text-red-400 animate-fade-in">{error}</p>}

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 rounded-lg font-medium transition mt-6"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

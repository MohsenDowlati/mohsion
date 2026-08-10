/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import {workspaceApi} from "@/services/api/workspaceApi"
import { addWorkspace } from "@/features/workspaces/workspaceSlice"
import  useAuth  from "@/hooks/useAuth"
import { ERRORS } from "@/utils/constants"
import  Button from "@/components/ui/Button"

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { token: authToken, initialized } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workspaceName, setWorkspaceName] = useState<string | null>(null)


useEffect(() => {
  if (!initialized) return
  if (!authToken) {
    router.replace(`/auth/signin?returnTo=${encodeURIComponent(`/invite/${token}`)}`)
    return
  }

  if (!token) return

  const handleRedeem = async () => {
    try {
      setLoading(true)

      const ws = await workspaceApi.redeemInvite(token)

      dispatch(addWorkspace(ws))

      setWorkspaceName(ws.name)

      setTimeout(() => {
        router.push(`/workspace/${ws.id}`)
      }, 1500)

    } catch (err: any) {
      setError(err?.message || ERRORS.INVALID_INVITE)
    } finally {
      setLoading(false)
    }
  }

  handleRedeem()

}, [token, authToken, initialized, dispatch, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900 text-neutral-100">
        <div className="text-center animate-pulse space-y-2">
          <div className="text-cyan-400 text-2xl font-semibold">
            Accepting your invite...
          </div>
          <div className="text-neutral-500 text-sm">
            Please wait while we join you to the workspace.
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-neutral-100 px-6">
        <h1 className="text-2xl mb-4 text-red-500 font-bold">Invite Error</h1>
        <p className="text-sm mb-6 text-neutral-400">{error}</p>
        <Button
          variant="primary"
          onClick={() => router.push("/workspace")}
          size="md"
        >
          Back to Workspaces
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-center text-neutral-100 px-6">
      <h1 className="text-3xl font-semibold text-cyan-400 mb-3">
        You’ve joined {workspaceName}!
      </h1>
      <p className="text-neutral-400 mb-6">
        Redirecting you to your workspace...
      </p>
      <Button
        variant="secondary"
        onClick={() => router.push(`/workspace`)}
        size="md"
      >
        Go now
      </Button>
    </div>
  )
}

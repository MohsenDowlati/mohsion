"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { addWorkspace, setWorkspaces } from "@/features/workspaces/workspaceSlice"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { workspaceApi } from "@/services/api/workspaceApi"
import { addToast } from "@/features/toasts/toastSlice"
import Logo from "@/components/ui/Logo"

export default function WorkspacePage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const workspaces = useSelector((state: RootState) => state.workspaces.workspaces)

  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await workspaceApi.getWorkspaces()
        dispatch(setWorkspaces(data))
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to fetch Workspace"
        )
      } finally {
        setLoaded(true)
      }
    }

    fetchData()
  }, [dispatch])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const createWorkspace = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError("")

    try {
      const data = await workspaceApi.createWorkspace({ name })
      dispatch(addWorkspace(data))
      dispatch(addToast({ message: "Workspace created", type: "success" }))
      setName("")
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Unable to create Workspace"
      setError(msg)
      dispatch(addToast({ message: msg, type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
            Your Workspaces
          </h1>
          <p className="text-slate-400">Organize your projects and collaborate with your team.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New workspace name"
            className="p-3 bg-slate-900 border border-slate-700 rounded-lg sm:w-80"
            onKeyDown={(e) => {
              if (e.key === "Enter") createWorkspace()
            }}
          />
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={createWorkspace}
            className="rounded-lg"
          >
            Create Workspace
          </Button>
        </div>

        {error && <p className="text-sm text-red-400 mb-6">{error}</p>}

        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-6 bg-slate-900 border border-slate-700/50 rounded-xl min-h-[200px]"
              >
                <div className="h-8 w-32 skeleton rounded mb-4" />
                <div className="h-4 w-48 skeleton rounded mb-2" />
                <div className="h-4 w-32 skeleton rounded" />
              </div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <Logo size={48} withText={false} href={null as unknown as string} />
            <p className="text-slate-400 mt-4 mb-2">No workspaces yet</p>
            <p className="text-slate-600 text-sm">Create your first workspace above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {workspaces.map((ws, i) => (
              <div
                key={ws.id}
                onClick={() => router.push(`/workspace/${ws.id}`)}
                className="group flex flex-col justify-between p-6 bg-slate-900 border border-blue-500/20 rounded-xl cursor-pointer hover:border-blue-400 hover:shadow-[0_0_24px_rgba(59,130,246,0.2)] transition-all duration-300 min-h-[200px] hover:-translate-y-1"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {ws.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Created {formatDate(ws.created_at)}
                  </p>
                </div>

                <p className="text-sm text-blue-400 group-hover:translate-x-1 transition-transform duration-200">
                  Open workspace →
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { addWorkspace, setWorkspaces } from "@/features/workspaces/workspaceSlice"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { workspaceApi } from "@/services/api/workspaceApi"

export default function WorkspacePage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const workspaces = useSelector((state: RootState) => state.workspaces.workspaces)

  const [name, setName] = useState("")
 // const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
  });
  }


  const createWorkspace = async () => {
    if (!name.trim()) return

    const newWorkspace = {
      name,
    }
    setError("");

    try {
      const data = await workspaceApi.createWorkspace(newWorkspace)
      dispatch(addWorkspace(data))
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create Workspace"
      )
    }

    
    setName("")
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl text-cyan-400 mb-8">
        Your Workspaces
      </h1>

      {/* create workspace */}
      <div className="flex gap-3 mb-10">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New workspace name"
          className="p-3 bg-gray-900 border border-gray-700 rounded w-80"
        />

        <Button
          variant="primary"
          size="lg"
          onClick={createWorkspace}
          className="px-6 bg-cyan-500 hover:bg-cyan-400 rounded"
        >
          Create
        </Button>
      </div>

      {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}

      {/* workspace list */}
      <div className="grid grid-cols-3 gap-6">

        {workspaces.map((ws) => (
          <div
            key={ws.id}
            onClick={() => router.push(`/workspace/${ws.id}`)}
            className="flex flex-col justify-between p-6 bg-gray-900 border border-cyan-500/20 rounded-lg cursor-pointer hover:border-cyan-400 transition my-1 min-h-[200px]"
          >
            <div>
              <h2 className="text-3xl text-white mb-2">
              {ws.name}
              </h2>
              <p className="text-base text-gray-400">
              Created at: 
              <span>{formatDate(ws.created_at)}</span>
              </p>
            </div>
            

            <p className="text-base text-gray-400">
              Open workspace →
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}

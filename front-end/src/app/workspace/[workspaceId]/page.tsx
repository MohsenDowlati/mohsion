"use client"

import WorkspaceBoard from "@/components/board/WorkspaceBoard"
import { use } from "react"

export default function WorkspacePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params)

  return (
    <div className="h-screen bg-slate-950 text-white">
      <WorkspaceBoard id={workspaceId} />
    </div>
  )
}

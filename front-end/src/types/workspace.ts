export type WorkspaceRole = "owner" | "editor" | "viewer"

export interface WorkspaceMember {
  userId: string
  role: WorkspaceRole
}

export interface Workspace {
  id: string
  name: string
  owner_id: string
  created_at: string
}


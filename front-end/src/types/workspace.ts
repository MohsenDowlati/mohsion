export type WorkspaceRole = "owner" | "editor" | "viewer"
export interface WorkspaceMember { userId: string; role: WorkspaceRole }
export interface Workspace { id: string; name: string; owner_id: string; created_at: string; my_role: WorkspaceRole }
export interface WorkspaceInvite {
    short_url?: string;
    token: string; role: Exclude<WorkspaceRole, "owner">; expiresIn: string }

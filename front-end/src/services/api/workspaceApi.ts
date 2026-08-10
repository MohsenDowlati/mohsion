import { getLocalStorage } from "@/utils/helper"
import { STORAGE_KEYS } from "@/utils/constants"
import { Workspace, WorkspaceInvite, WorkspaceRole } from "@/types/workspace"
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getLocalStorage(STORAGE_KEYS.TOKEN, null)}` })
async function parse<T>(response: Response): Promise<T> { const data = await response.json().catch(() => null) as T | {message?:string} | null; if (!response.ok) throw new Error((data as {message?:string})?.message || "Workspace request failed"); return data as T }
export const workspaceApi = {
  async getWorkspaces(): Promise<Workspace[]> { return parse(await fetch(`${API_URL}/workspace`, { headers: headers() })) },
  async getWorkspace(workspaceId: string): Promise<Workspace> { return parse(await fetch(`${API_URL}/workspace/${workspaceId}`, { headers: headers() })) },
  async createWorkspace(payload: {name:string}): Promise<Workspace> { return parse(await fetch(`${API_URL}/workspace`, { method:"POST", headers:headers(), body:JSON.stringify(payload) })) },
  async createInvite(workspaceId: string, role: Exclude<WorkspaceRole,"owner">): Promise<WorkspaceInvite> { return parse(await fetch(`${API_URL}/workspace/${workspaceId}/invites`, { method:"POST", headers:headers(), body:JSON.stringify({role}) })) },
  async redeemInvite(token: string): Promise<Workspace> { return parse(await fetch(`${API_URL}/workspace/invites/${encodeURIComponent(token)}/redeem`, { method:"POST", headers:headers() })) },
}

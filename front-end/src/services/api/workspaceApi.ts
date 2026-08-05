import { getLocalStorage } from "@/utils/helper"
import { STORAGE_KEYS } from "@/utils/constants"
import { Workspace } from "@/types/workspace"


type WorkspacePayload = {
  name: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"


// --- API Methods ---
export const workspaceApi = {
  async getWorkspaces():Promise<Workspace[]> {
    const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
    const response = await fetch(`${API_URL}/workspace`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })

  const data = await response.json().catch(() => null) as
    | Workspace[]
    | { message?: string }
    | null

  if (!response.ok) {
    throw new Error("Workspace request failed")
  }

  return data as Workspace[]
  },

  async createWorkspace(payload: WorkspacePayload):Promise<Workspace> {
    const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
    const response = await fetch(`${API_URL}/workspace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json().catch(() => null) as
    | Workspace[]
    | { message?: string }
    | null

  if (!response.ok) {
    throw new Error("Workspace request failed")
  }

  return data as Workspace
  },

}

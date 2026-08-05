import { List } from "@/features/lists/listSlice"
import { STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorage } from "@/utils/helper";

type ListPayload = {
  title: string
  position: number
}

type UpdateListPayload = {
  title?: string
  position?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"

function authHeaders(): Record<string, string> {
  const token = getLocalStorage(STORAGE_KEYS.TOKEN, null)
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  }
}

function parseError(res: Response): string {
  if (res.status === 401) return "Your session has expired. Please sign in again."
  if (res.status === 403) return "You don't have access to this workspace."
  if (res.status === 404) return "This list no longer exists."
  return "Something went wrong. Please try again."
}

const listApi = {
  async getLists(workspaceId: string): Promise<List[]> {
    const response = await fetch(`${API_URL}/list/workspace/${workspaceId}`, {
      method: "GET",
      headers: authHeaders(),
    })
    const data = await response.json().catch(() => null) as List[] | null
    if (!response.ok) throw new Error(parseError(response))
    return data as List[]
  },

  async newList(workspaceId: string, payload: ListPayload): Promise<List> {
    const response = await fetch(`${API_URL}/list/workspace/${workspaceId}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null) as List | null
    if (!response.ok) throw new Error(parseError(response))
    return data as List
  },

  async updateList(listId: string, payload: UpdateListPayload): Promise<List> {
    const response = await fetch(`${API_URL}/list/${listId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null) as List | null
    if (!response.ok) throw new Error(parseError(response))
    return data as List
  },

  async deleteList(listId: string): Promise<void> {
    const response = await fetch(`${API_URL}/list/${listId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error(parseError(response))
  },
}

export default listApi;

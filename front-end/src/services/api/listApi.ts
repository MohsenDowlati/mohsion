import { List } from "@/features/lists/listSlice"
import { STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorage } from "@/utils/helper";

type ListPayload = {
  title: string
  position: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"

const listApi = {
  async getLists(workspaceId: string): Promise<List[]> {
          const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
        const response = await fetch(`${API_URL}/list/workspace/${workspaceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
    
      const data = await response.json().catch(() => null) as
        | List[]
        | { message?: string }
        | null
    
      if (!response.ok) {
        throw new Error("List request failed")
      }
    
      return data as List[]


  },

  async newList(workspaceId: string, payload: ListPayload): Promise<List> {
        const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
        const response = await fetch(`${API_URL}/list/workspace/${workspaceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
    
      const data = await response.json().catch(() => null) as
        | List
        | { message?: string }
        | null
    
      if (!response.ok) {
        throw new Error("List request failed")
      }
    
      return data as List
    }

}

export default listApi;

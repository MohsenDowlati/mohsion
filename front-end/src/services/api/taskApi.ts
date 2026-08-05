import { Task } from "@/features/tasks/taskSlice";
import { TaskPriority } from "@/types/task";
import { STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorage } from "@/utils/helper";

type TaskPayload = {
  title: string
  description?: string
  position: number
  priority: TaskPriority
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"


const taskApi = {
  
  async getTasks(listId: string): Promise<Task[]> {
          const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
          const response = await fetch(`${API_URL}/todo/${listId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })
      
        const data = await response.json().catch(() => null) as
          | Task[]
          | { message?: string }
          | null
      
        if (!response.ok) {
          throw new Error("Task request failed")
        }
      
        return data as Task[]
    },
    async getWorkspaceTasks(workspaceId: string, signal?: AbortSignal): Promise<Task[]> {
          const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
          const response = await fetch(`${API_URL}/todo/workspace/${workspaceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          cache: "no-store",
          signal,
        })

        const data = await response.json().catch(() => null) as
          | Task[]
          | { message?: string }
          | null

        if (!response.ok) {
          throw new Error("Task request failed")
        }

        return data as Task[]
    },
    async newTask(listId: string, payload: TaskPayload): Promise<Task> {
          const token = getLocalStorage(STORAGE_KEYS.TOKEN,null);
          const response = await fetch(`${API_URL}/todo/${listId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      
        const data = await response.json().catch(() => null) as
          | Task
          | { message?: string }
          | null
      
        if (!response.ok) {
          throw new Error("Task request failed")
        }
      
        return data as Task
    },
    
}

export default taskApi

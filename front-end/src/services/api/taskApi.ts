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

type UpdateTaskPayload = {
  title?: string
  description?: string
  position?: number
  completed?: boolean
  priority?: TaskPriority
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
  if (res.status === 404) return "This task no longer exists."
  return "Something went wrong. Please try again."
}

const taskApi = {
  async getTasks(listId: string): Promise<Task[]> {
    const response = await fetch(`${API_URL}/todo/${listId}`, {
      method: "GET",
      headers: authHeaders(),
    })
    const data = await response.json().catch(() => null) as Task[] | null
    if (!response.ok) throw new Error(parseError(response))
    return data as Task[]
  },

  async getWorkspaceTasks(workspaceId: string, signal?: AbortSignal): Promise<Task[]> {
    const response = await fetch(`${API_URL}/todo/workspace/${workspaceId}`, {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
      signal,
    })
    const data = await response.json().catch(() => null) as Task[] | null
    if (!response.ok) throw new Error(parseError(response))
    return data as Task[]
  },

  async newTask(listId: string, payload: TaskPayload): Promise<Task> {
    const response = await fetch(`${API_URL}/todo/${listId}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null) as Task | null
    if (!response.ok) throw new Error(parseError(response))
    return data as Task
  },

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await fetch(`${API_URL}/todo/task/${taskId}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null) as Task | null
    if (!response.ok) throw new Error(parseError(response))
    return data as Task
  },

  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_URL}/todo/task/${taskId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    if (!response.ok) throw new Error(parseError(response))
  },
}

export default taskApi

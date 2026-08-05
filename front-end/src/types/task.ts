export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  list_id: string
  title: string
  description?: string | undefined
  completed: boolean
  priority: TaskPriority
  position: number
  created_by: string
  updated_at: string
}

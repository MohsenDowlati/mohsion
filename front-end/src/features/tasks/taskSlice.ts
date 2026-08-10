import { TaskPriority } from "@/types/task"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Task = {
  id: string
  list_id: string
  title: string
  description?: string
  completed: boolean
  position: number
  priority: TaskPriority
  created_by: string
  updated_at: string
}

type TaskState = {
  tasks: Record<string,Task[]>
  loading: boolean
}

const initialState: TaskState = {
  tasks: {},
  loading: false
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // load tasks
    setTasks: (
  state,
  action: PayloadAction<{ listId: string; tasks: Task[] }>
  ) => {
    const { listId, tasks } = action.payload
    state.tasks[listId] = tasks
  },

    setWorkspaceTasks: (
      state,
      action: PayloadAction<{ listIds: string[]; tasks: Task[] }>
    ) => {
      const { listIds, tasks } = action.payload

      for (const listId of listIds) {
        state.tasks[listId] = []
      }

      for (const task of tasks) {
        state.tasks[task.list_id] ??= []
        state.tasks[task.list_id].push(task)
      }
    },

    // create
    addTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload
      for (const listId in state.tasks) {
        const index = state.tasks[listId].findIndex((item) => item.id === task.id)
        if (index !== -1) state.tasks[listId].splice(index, 1)
      }
      state.tasks[task.list_id] ??= []
      state.tasks[task.list_id].push(task)
      state.tasks[task.list_id].sort((a, b) => a.position - b.position)
    },

    // update title/description/completed
    updateTask: (
  state,
  action: PayloadAction<{ id: string; data: Partial<Task> }>
) => {
  const { id, data } = action.payload

  // Step 1: find the task in all lists
  for (const listId in state.tasks) {
    const index = state.tasks[listId].findIndex(t => t.id === id)

    if (index !== -1) {
      const oldTask = state.tasks[listId][index]
      const updatedTask = { ...oldTask, ...data }

      // Step 2: if list_id didn't change → simple update
      if (updatedTask.list_id === oldTask.list_id) {
        state.tasks[listId][index] = updatedTask
        state.tasks[listId].sort((a, b) => a.position - b.position)
        return
      }

      // Step 3: list_id changed → move task to another list
      // Remove from old list
      state.tasks[listId].splice(index, 1)

      // Add to new list
      if (!state.tasks[updatedTask.list_id]) {
        state.tasks[updatedTask.list_id] = []
      }

      state.tasks[updatedTask.list_id].push(updatedTask)
      return
    }
  }
}, 

    // delete
    removeTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload

    for (const listId in state.tasks) {
      const index = state.tasks[listId].findIndex(t => t.id === taskId)

    if (index !== -1) {
      state.tasks[listId].splice(index, 1)
      return
    }
  }
    },

    // reorder tasks inside same list
    reorderTasks: (
      state,
      action: PayloadAction<{
        listId: string
        activeId: string
        overId: string
      }>
    ) => {
    const { listId, activeId, overId } = action.payload

  const tasks = state.tasks[listId]
  if (!tasks) return

  const fromIndex = tasks.findIndex(t => t.id === activeId)
  const toIndex = tasks.findIndex(t => t.id === overId)

  if (fromIndex === -1 || toIndex === -1) return

  const [moved] = tasks.splice(fromIndex, 1)
  tasks.splice(toIndex, 0, moved)

  // update positions
  tasks.forEach((task, index) => {
    task.position = index
  })
      
    },

    // move task between lists
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string
        toListId: string
        newPosition: number
      }>
    ) => {
      const { taskId, toListId, newPosition } = action.payload

  let fromListId: string | null = null
  let task: Task | null = null

  // 1. find task in any list
  for (const listId in state.tasks) {
    const index = state.tasks[listId].findIndex(t => t.id === taskId)
    if (index !== -1) {
      fromListId = listId
      task = state.tasks[listId][index]
      state.tasks[listId].splice(index, 1) // remove from old list
      break
    }
  }

  if (!task) return

  // 2. ensure destination list exists
  if (!state.tasks[toListId]) {
    state.tasks[toListId] = []
  }

  // 3. update task fields
  task.list_id = toListId

  // 4. clamp position inside valid range
  const targetList = state.tasks[toListId]
  const safePos = Math.max(0, Math.min(newPosition, targetList.length))

  // 5. insert task into new list
  targetList.splice(safePos, 0, task)

  // 6. reorder positions in destination list
  targetList.forEach((t, index) => {
    t.position = index
  })

  // 7. reorder positions in the old list if needed
  if (fromListId) {
    state.tasks[fromListId].forEach((t, index) => {
      t.position = index
    })
  }
    },

    // clear on logout
    clearTasks: (state) => {
      state.tasks = {}
    }
  }
})

export const {
  setTasks,
  setWorkspaceTasks,
  addTask,
  updateTask,
  removeTask,
  reorderTasks,
  moveTask,
  clearTasks
} = taskSlice.actions

export default taskSlice.reducer

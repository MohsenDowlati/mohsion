import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type List = {
  id: string
  workspace_id: string
  title: string
  position: number  // good for ordering
}

export type ListState = {
  lists: List[]
  loading: boolean
}

const initialState: ListState = {
  lists: [],
  loading: false
}

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    // Load lists for a workspace
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload.sort(
        (a, b) => a.position - b.position
      )
    },

    // Create new list
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload)
      state.lists.sort((a, b) => a.position - b.position)
    },

    // Update list title or fields
    updateList: (
      state,
      action: PayloadAction<{ id: string; data: Partial<List> }>
    ) => {
      const { id, data } = action.payload
      const index = state.lists.findIndex(l => l.id === id)
      if (index !== -1) {
        state.lists[index] = { ...state.lists[index], ...data }
      }
    },

    // Remove a list
    removeList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(l => l.id !== action.payload)
    },

    // Reorder client-side (drag + drop)
    reorderLists: (
      state,
      action: PayloadAction<{
        activeId: string
        overId: string
      }>
    ) => {
      const { activeId, overId } = action.payload
      const fromIndex = state.lists.findIndex(l => l.id === activeId)
      const toIndex = state.lists.findIndex(l => l.id === overId)

      if (fromIndex === -1 || toIndex === -1) return

      const [moved] = state.lists.splice(fromIndex, 1)
      state.lists.splice(toIndex, 0, moved)

      // Reset positions
      state.lists = state.lists.map((l, i) => ({
        ...l,
        position: i
      }))
    },

    // used on logout
    clearLists: (state) => {
      state.lists = []
    }
  }
})

export const {
  setLists,
  addList,
  updateList,
  removeList,
  reorderLists,
  clearLists
} = listSlice.actions

export default listSlice.reducer

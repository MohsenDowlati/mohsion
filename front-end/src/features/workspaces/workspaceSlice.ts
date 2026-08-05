import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Workspace } from "@/types/workspace"

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
}

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces(state, action: PayloadAction<Workspace[]>) {
      state.workspaces = action.payload
    },

    addWorkspace(state, action: PayloadAction<Workspace>) {
      state.workspaces.push(action.payload)
    },

    updateWorkspace(state, action: PayloadAction<Workspace>) {
      const index = state.workspaces.findIndex(
        w => w.id === action.payload.id
      )

      if (index !== -1) {
        state.workspaces[index] = action.payload
      }
    },

    deleteWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.filter(
        w => w.id !== action.payload
      )

      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = null
      }
    },

    setActiveWorkspace(state, action: PayloadAction<string>) {
      state.activeWorkspaceId = action.payload
    },

    clearWorkspaces(state) {
      state.workspaces = []
      state.activeWorkspaceId = null
    },
  },
})

export const {
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setActiveWorkspace,
  clearWorkspaces,
} = workspaceSlice.actions

export default workspaceSlice.reducer

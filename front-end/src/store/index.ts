import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/authSlice"
import workspaceReducer from "@/features/workspaces/workspaceSlice"
import listReducer from "@/features/lists/listSlice"
import taskReducer from "@/features/tasks/taskSlice"
import toastReducer from "@/features/toasts/toastSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspaces: workspaceReducer,
    lists: listReducer,
    tasks: taskReducer,
    toasts: toastReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

let counter = 0

const toastSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload)
      },
      prepare: (toast: Omit<Toast, "id">) => ({
        payload: { ...toast, id: `toast-${++counter}` },
      }),
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
  },
})

export const { addToast, removeToast, clearToasts } = toastSlice.actions
export default toastSlice.reducer

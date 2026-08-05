// App‑wide constants for workspace/list/task mock data, UI, and system config.

// =========================================================
// STORAGE KEYS (localStorage namespaces)
// =========================================================
export const STORAGE_KEYS = {
  USER: "mock_user",
  TOKEN: "mock_token",

  WORKSPACES: "mock_workspaces",
  LISTS: "mock_lists",
  TASKS: "mock_tasks",

  INVITES: "mock_invites"
} as const

// =========================================================
// UI CONSTANTS
// =========================================================
export const UI = {
  SIDEBAR_WIDTH: 260,
  NAVBAR_HEIGHT: 64,

  // Tailwind theme values (matching your cyan/futuristic theme)
  THEME: {
    PRIMARY: "cyan-400",
    BACKGROUND: "neutral-900",
    TEXT: "neutral-100"
  }
} as const

// =========================================================
// DND CONSTANTS (for @dnd-kit implementation)
// =========================================================
export const DND = {
  LIST_TYPE: "LIST",
  TASK_TYPE: "TASK",

  // Time threshold to trigger auto-drag scrolling
  SCROLL_EDGE_OFFSET: 80,
  SCROLL_SPEED: 18
} as const

// =========================================================
// ERROR MESSAGES
// =========================================================
export const ERRORS = {
  AUTH_REQUIRED: "Authentication required.",
  INVALID_INVITE: "Invalid or expired invite token.",
  WORKSPACE_NOT_FOUND: "Workspace not found.",
  LIST_NOT_FOUND: "List not found.",
  TASK_NOT_FOUND: "Task not found."
} as const

// =========================================================
// MISC
// =========================================================
export const APP = {
  NAME: "Realtime Todo",
  DESCRIPTION: "A collaborative task manager with realtime capabilities."
} as const

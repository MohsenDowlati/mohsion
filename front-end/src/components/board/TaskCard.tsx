"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Task } from "@/types/task"
import { updateTask, removeTask } from "@/features/tasks/taskSlice"
import taskApi from "@/services/api/taskApi"
import { addToast } from "@/features/toasts/toastSlice"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Dropdown from "../ui/DropDown"
import { TaskPriority } from "@/types/task"

export default function TaskCard({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description ?? "")
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority)

  const priorityColor =
    task.priority === "low"
      ? "text-emerald-400 bg-emerald-500/10"
      : task.priority === "medium"
      ? "text-amber-400 bg-amber-500/10"
      : "text-red-400 bg-red-500/10"

  const toggleComplete = async () => {
    const newCompleted = !task.completed
    dispatch(updateTask({ id: task.id, data: { completed: newCompleted } }))
    try {
      await taskApi.updateTask(task.id, { completed: newCompleted })
    } catch {
      dispatch(updateTask({ id: task.id, data: { completed: !newCompleted } }))
      dispatch(addToast({ message: "Failed to update task", type: "error" }))
    }
  }

  const saveEdit = async () => {
    setLoading(true)
    try {
      const updated = await taskApi.updateTask(task.id, {
        title: editTitle,
        description: editDesc,
        priority: editPriority,
      })
      dispatch(updateTask({ id: task.id, data: updated }))
      setEditing(false)
      dispatch(addToast({ message: "Task updated", type: "success" }))
    } catch {
      dispatch(addToast({ message: "Failed to update task", type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    setLoading(true)
    try {
      await taskApi.deleteTask(task.id)
      dispatch(removeTask(task.id))
      setDeleting(false)
      dispatch(addToast({ message: "Task deleted", type: "success" }))
    } catch {
      dispatch(addToast({ message: "Failed to delete task", type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={`group bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-200 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] cursor-grab active:cursor-grabbing ${
          task.completed ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button
              onClick={toggleComplete}
              disabled={!canEdit}
              className={`mt-0.5 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center shrink-0 ${
                task.completed
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-600 hover:border-blue-400"
              }`}
            >
              {task.completed && (
                <span className="text-white text-xs">✓</span>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm text-slate-100 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <span
            className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${priorityColor}`}
          >
            {task.priority}
          </span>
        </div>

        {/* Action buttons - revealed on hover */}
        {canEdit && <div className="flex gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => {
              setEditTitle(task.title)
              setEditDesc(task.description ?? "")
              setEditPriority(task.priority)
              setEditing(true)
            }}
            className="text-xs text-blue-400 hover:text-blue-300 transition"
          >
            Edit
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setDeleting(true)}
            className="text-xs text-red-400 hover:text-red-300 transition"
          >
            Delete
          </button>
        </div>}
      </div>

      {/* Edit Modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Task">
        <div className="space-y-4">
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />
          <Input
            label="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Priority</label>
            <Dropdown value={editPriority} onSelect={(val) => setEditPriority(val)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              className="flex-1 py-3 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              loading={loading}
              className="flex-1 py-3 rounded-lg"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={deleting} onClose={() => setDeleting(false)} title="Delete Task">
        <p className="text-slate-300 mb-6">
          Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleting(false)}
            className="flex-1 py-3 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            loading={loading}
            className="flex-1 py-3 rounded-lg"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}

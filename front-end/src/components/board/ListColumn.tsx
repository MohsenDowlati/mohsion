"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"
import { addTask } from "@/features/tasks/taskSlice"
import { useState } from "react"
import taskApi from "@/services/api/taskApi"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Dropdown from "../ui/DropDown"
import { TaskPriority } from "@/types/task"
import { addToast } from "@/features/toasts/toastSlice"

type Props = {
  title: string
  id: string
}

function SortableTaskCard({ task }: { task: import("@/types/task").Task }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", listId: task.list_id },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  )
}

export default function ListColumn({ title, id }: Props) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks[id] || [])
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [taskTitle, setTaskTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("low")

  const [openModal, setOpenModal] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: `list-${id}`,
    data: { type: "list", listId: id },
  })

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!taskTitle.trim()) {
      dispatch(addToast({ message: "Task title cannot be empty", type: "warning" }))
      return
    }

    setError("")
    setLoading(true)

    try {
      const data = await taskApi.newTask(id, {
        title: taskTitle,
        description,
        priority,
        position: tasks.length,
      })
      dispatch(addTask(data))
      setOpenModal(false)
      dispatch(addToast({ message: "Task created", type: "success" }))
      setTaskTitle("")
      setDescription("")
      setPriority("low")
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Unable to create Task"
      setError(msg)
      dispatch(addToast({ message: msg, type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className={`bg-slate-900 rounded-xl p-3 sm:p-4 w-72 sm:w-80 shrink-0 min-h-[200px] border transition-all duration-200 ${
          isOver
            ? "border-blue-500 drag-over"
            : "border-slate-700/50"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-blue-400 text-base font-semibold">{title}</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setDescription("")
              setPriority("low")
              setTaskTitle("")
              setOpenModal(true)
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-md
              border border-blue-400 text-blue-300
              hover:bg-blue-500 hover:text-white
              transition-all duration-200 active:scale-95"
          >
            + CREATE
          </button>
        </div>

        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 min-h-[40px]">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`New task for ${title}`}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={taskTitle}
            placeholder="Add a Task"
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />
          <Input
            label="Description"
            value={description}
            placeholder="There is something to do."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Priority</label>
            <Dropdown onSelect={(val) => setPriority(val)} />
          </div>
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="w-full py-3 rounded-lg font-medium transition mt-6"
          >
            Create Task
          </Button>
        </div>
      </Modal>
    </>
  )
}

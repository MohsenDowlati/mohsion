"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import ListColumn from "./ListColumn"
import { useEffect, useState } from "react"
import { addList, setLists } from "@/features/lists/listSlice"
import listApi from "@/services/api/listApi"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { useRouter } from "next/navigation"
import taskApi from "@/services/api/taskApi"
import { setWorkspaceTasks, reorderTasks, moveTask } from "@/features/tasks/taskSlice"
import { addToast } from "@/features/toasts/toastSlice"
import taskApiInstance from "@/services/api/taskApi"
import type { Task } from "@/types/task"

export default function WorkspaceBoard({ id }: { id: string }) {
  const router = useRouter()
  const lists = useSelector((state: RootState) => state.lists.lists)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dataLoaded, setDataLoaded] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [title, setTitle] = useState("")

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const dispatch = useDispatch()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await listApi.newList(id, { title, position: lists.length })
      dispatch(addList(data))
      setOpenModal(false)
      setTitle("")
      dispatch(addToast({ message: "List created", type: "success" }))
    } catch (submitError) {
      const msg = submitError instanceof Error ? submitError.message : "Unable to create list"
      setError(msg)
      dispatch(addToast({ message: msg, type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const [listData, taskData] = await Promise.all([
          listApi.getLists(id),
          taskApi.getWorkspaceTasks(id, controller.signal),
        ])

        dispatch(setLists(listData))
        dispatch(
          setWorkspaceTasks({
            listIds: listData.map((list) => list.id),
            tasks: taskData,
          })
        )
        setDataLoaded(true)
      } catch (submitError) {
        if (submitError instanceof DOMException && submitError.name === "AbortError") {
          return
        }

        const msg = submitError instanceof Error ? submitError.message : "Unable to fetch workspace"
        setError(msg)
        setDataLoaded(true)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [dispatch, id])

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string
    for (const listId in allTasks) {
      const found = allTasks[listId].find((t) => t.id === taskId)
      if (found) {
        setActiveTask(found)
        return
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeData = active.data.current
    const overData = over.data.current

    if (!activeData || activeData.type !== "task") return

    const fromListId = activeData.listId as string

    if (overData?.type === "task") {
      const toListId = overData.listId as string

      if (fromListId === toListId) {
        dispatch(reorderTasks({ listId: fromListId, activeId, overId }))
      } else {
        const targetTasks = allTasks[toListId] || []
        const overIndex = targetTasks.findIndex((t) => t.id === overId)
        dispatch(
          moveTask({
            taskId: activeId,
            toListId,
            newPosition: overIndex >= 0 ? overIndex : targetTasks.length,
          })
        )

        try {
          await taskApiInstance.updateTask(activeId, {
            list_id: toListId,
            position: overIndex >= 0 ? overIndex : targetTasks.length,
          } as Partial<import("@/features/tasks/taskSlice").Task>)
        } catch {
          dispatch(addToast({ message: "Failed to move task", type: "error" }))
        }
      }
    } else if (overData?.type === "list") {
      const toListId = overData.listId as string
      if (fromListId === toListId) return

      dispatch(
        moveTask({
          taskId: activeId,
          toListId,
          newPosition: allTasks[toListId]?.length || 0,
        })
      )

      try {
        await taskApiInstance.updateTask(activeId, {
          list_id: toListId,
          position: allTasks[toListId]?.length || 0,
        } as Partial<import("@/features/tasks/taskSlice").Task>)
        dispatch(addToast({ message: "Task moved", type: "success" }))
      } catch {
        dispatch(addToast({ message: "Failed to move task", type: "error" }))
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen bg-slate-950 text-white flex flex-col">
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/workspace")}
            className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border border-blue-500/30 text-blue-400 hover:border-blue-400 hover:bg-slate-800 transition-all active:scale-95"
          >
            ‹ Back
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-200">Board</h1>
        </div>

        {!dataLoaded ? (
          <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-72 sm:w-80 shrink-0 rounded-xl p-4 bg-slate-900 border border-slate-700/50"
              >
                <div className="h-6 w-32 skeleton rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-16 skeleton rounded-lg" />
                  <div className="h-16 skeleton rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto p-4 sm:p-6 flex-1 stagger">
            {lists.map((list, i) => (
              <div key={list.id} style={{ "--i": i } as React.CSSProperties}>
                <ListColumn id={list.id} title={list.title} />
              </div>
            ))}

            {lists.length === 0 && !error && (
              <div className="flex items-center justify-center w-full text-slate-500">
                <p>No lists yet. Create one to get started.</p>
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* Floating add button */}
        <button
          className="w-12 h-12 sm:w-14 sm:h-14 text-3xl sm:text-4xl rounded-full fixed right-4 bottom-4 sm:right-6 sm:bottom-6 bg-blue-600 border border-blue-400 text-white hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-200 active:scale-90 flex items-center justify-center leading-none shadow-[0_0_16px_rgba(59,130,246,0.4)] animate-pulse-glow z-30"
          onClick={() => {
            setOpenModal(true)
            setTitle("")
          }}
          aria-label="Add new list"
        >
          +
        </button>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-slate-800 p-3 rounded-lg border border-blue-500 shadow-2xl cursor-grabbing opacity-90 w-64 sm:w-72">
            <p className="text-sm text-slate-100">{activeTask.title}</p>
          </div>
        ) : null}
      </DragOverlay>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="New List">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="List name"
            value={title}
            placeholder="Execution Board"
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 outline-none"
          />
          <Button
            type="submit"
            loading={loading}
            className="w-full py-3 rounded-lg font-medium transition mt-6"
          >
            Create List
          </Button>
        </form>
      </Modal>
    </DndContext>
  )
}

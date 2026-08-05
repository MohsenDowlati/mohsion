"use client"

import { DndContext } from "@dnd-kit/core"
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
import { setWorkspaceTasks } from "@/features/tasks/taskSlice"

export default function WorkspaceBoard({id}:{id:string}) {

  const router = useRouter();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("")

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await listApi.newList(id, {title, position:0});
      dispatch(addList(data))
      setOpenModal(false)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create list"
      )
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
        dispatch(setWorkspaceTasks({
          listIds: listData.map((list) => list.id),
          tasks: taskData,
        }))
      } catch (submitError) {
        if (submitError instanceof DOMException && submitError.name === "AbortError") {
          return
        }

        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to fetch workspace"
        )
      }
    }

    fetchData()

    return () => controller.abort()
  }, [dispatch,id])
  
  return (
    <DndContext>
      <Button className="ml-6 mt-4" onClick={()=>{router.push("/workspace")}}>‹ Back</Button>
      <div className="flex gap-4 overflow-x-auto p-6">
        {lists.map((list) => (
          <ListColumn key={list.id} id={list.id} title={list.title} />
        ))}
        {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}

        <button className="w-16 h-16 text-6xl rounded-full fixed right-4 bottom-4 bg-gray-900 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400"
        onClick={()=>{setOpenModal(true);setTitle("");}}>
          +
        </button>
      </div>

      <Modal open={openModal} onClose={()=>setOpenModal(false)} title="New List">
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={title} placeholder="Execution Board" onChange={(e)=>setTitle(e.target.value)} required className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none" />
            <Button type="submit" loading={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition mt-6">Create</Button>
        </form>
      </Modal>
    </DndContext>
  )
}

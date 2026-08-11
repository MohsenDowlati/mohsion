"use client"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"
import { addTask, removeTasksForList, type Task } from "@/features/tasks/taskSlice"
import { removeList, updateList } from "@/features/lists/listSlice"
import { useState } from "react"
import taskApi from "@/services/api/taskApi"
import listApi from "@/services/api/listApi"
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Dropdown from "../ui/DropDown"
import { TaskPriority } from "@/types/task"
import { addToast } from "@/features/toasts/toastSlice"

type Props = { title: string; id: string; canEdit: boolean }
function SortableTaskCard({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: "task", listId: task.list_id }, disabled: !canEdit })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  return <div ref={setNodeRef} style={style} {...(canEdit ? attributes : {})} {...(canEdit ? listeners : {})}><TaskCard task={task} canEdit={canEdit} /></div>
}
export default function ListColumn({ title, id, canEdit }: Props) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks[id] || [])
  const dispatch = useDispatch()
  const [loading,setLoading]=useState(false), [error,setError]=useState("")
  const [taskTitle,setTaskTitle]=useState(""), [description,setDescription]=useState(""), [priority,setPriority]=useState<TaskPriority>("low")
  const [openModal,setOpenModal]=useState(false), [editing,setEditing]=useState(false), [deleting,setDeleting]=useState(false), [editTitle,setEditTitle]=useState(title)
  const droppable = useDroppable({ id: `list-${id}`, data:{type:"list",listId:id}, disabled:!canEdit })
  const createTask = async () => { if(!taskTitle.trim()) return void dispatch(addToast({message:"Task title cannot be empty",type:"warning"})); setLoading(true); setError(""); try { const data=await taskApi.newTask(id,{title:taskTitle.trim(),description,priority,position:tasks.length}); dispatch(addTask(data)); setOpenModal(false); setTaskTitle(""); setDescription(""); setPriority("low"); dispatch(addToast({message:"Task created",type:"success"})) } catch(e){const m=e instanceof Error?e.message:"Unable to create task";setError(m);dispatch(addToast({message:m,type:"error"}))} finally{setLoading(false)} }
  const saveList = async () => { if(!editTitle.trim()) return; setLoading(true); try { const list=await listApi.updateList(id,{title:editTitle.trim()}); dispatch(updateList({id,data:list})); setEditing(false); dispatch(addToast({message:"List updated",type:"success"})) } catch(e){dispatch(addToast({message:e instanceof Error?e.message:"Failed to update list",type:"error"}))} finally{setLoading(false)} }
  const deleteList = async () => { setLoading(true); try { await listApi.deleteList(id); dispatch(removeList(id)); dispatch(removeTasksForList(id)); setDeleting(false); dispatch(addToast({message:"List deleted",type:"success"})) } catch(e){dispatch(addToast({message:e instanceof Error?e.message:"Failed to delete list",type:"error"}))} finally{setLoading(false)} }
  return <>
    <div ref={droppable.setNodeRef} className={`bg-slate-900 rounded-xl p-3 sm:p-4 w-72 sm:w-80 shrink-0 min-h-[200px] border transition-all duration-200 ${droppable.isOver?"border-blue-500 drag-over":"border-slate-700/50"}`}>
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2 min-w-0"><h3 className="text-blue-400 text-base font-semibold truncate">{title}</h3><span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{tasks.length}</span></div>
      {canEdit && <div className="flex gap-2"><button onClick={()=>{setEditTitle(title);setEditing(true)}} className="text-xs text-slate-400 hover:text-blue-300">Edit</button><button onClick={()=>setDeleting(true)} className="text-xs text-slate-400 hover:text-red-300">Delete</button><button onClick={()=>{setDescription("");setPriority("low");setTaskTitle("");setOpenModal(true)}} className="px-3 py-1.5 text-xs font-semibold rounded-md border border-blue-400 text-blue-300 hover:bg-blue-500 hover:text-white transition-all">+ CREATE</button></div>}</div>
      <SortableContext items={tasks.map(t=>t.id)} strategy={verticalListSortingStrategy}><div className="space-y-2 min-h-[40px]">{tasks.map(task=><SortableTaskCard key={task.id} task={task} canEdit={canEdit}/>)}</div></SortableContext>
      {error&&<p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
    <Modal open={openModal} onClose={()=>setOpenModal(false)} title={`New task for ${title}`}><div className="space-y-4"><Input label="Title" value={taskTitle} placeholder="Add a Task" onChange={e=>setTaskTitle(e.target.value)} required/><Input label="Description" value={description} placeholder="There is something to do." onChange={e=>setDescription(e.target.value)}/><div><label className="text-sm text-slate-300">Priority</label><Dropdown value={priority} onSelect={setPriority}/></div><Button onClick={createTask} loading={loading} className="w-full">Create Task</Button></div></Modal>
    <Modal open={editing} onClose={()=>setEditing(false)} title="Edit List"><div className="space-y-4"><Input label="List name" value={editTitle} onChange={e=>setEditTitle(e.target.value)}/><Button onClick={saveList} loading={loading} className="w-full">Save</Button></div></Modal>
    <Modal open={deleting} onClose={()=>setDeleting(false)} title="Delete List"><p className="text-slate-300 mb-6">Delete “{title}” and all of its tasks?</p><div className="flex gap-3"><Button variant="secondary" onClick={()=>setDeleting(false)} className="flex-1">Cancel</Button><Button variant="danger" onClick={deleteList} loading={loading} className="flex-1">Delete</Button></div></Modal>
  </>
}

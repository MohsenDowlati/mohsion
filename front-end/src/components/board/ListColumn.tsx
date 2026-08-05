import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import TaskCard from "./TaskCard"
import { addTask } from "@/features/tasks/taskSlice"
import { useState } from "react"
import taskApi from "@/services/api/taskApi";
import Modal from "../ui/Modal"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Dropdown from "../ui/DropDown"
import { TaskPriority } from "@/types/task"

export default function ListColumn({ title, id }: { title: string , id:string}) {
  const tasks = useSelector((state: RootState) => state.tasks.tasks[id] || [])

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("low");

  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setError("")
      setLoading(true)
  
      try {
        const data = await taskApi.newTask(id, {title:taskTitle,description,priority, position:0});
        dispatch(addTask(data))
        setOpenModal(false)
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to create Task"
        )
      } finally {
        setLoading(false)
      }
    }


  return (
    <>
    <div className="bg-gray-900 rounded-xl p-4 w-96 min-h-[70vh]">
      <div className="flex items-center justify-between mb-5">
  <h3 className="text-neon text-base">
    {title}
  </h3>

  <button
      type="button"
      onClick={() => {setDescription("");setPriority("low");setTaskTitle("");setOpenModal(true)}}
      className="px-4 py-1.5 text-xs font-semibold rounded-md 
    border border-cyan-400 text-cyan-300
    shadow-[0_0_8px_rgba(34,211,238,0.6)]
    hover:bg-cyan-400 hover:text-black
    hover:shadow-[0_0_14px_rgba(34,211,238,1)]
    transition-all duration-200"
    >
      + CREATE
    </button>
  </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}
    </div>
    <Modal open={openModal} onClose={()=>setOpenModal(false)} title={`New task for ${title}`}>
      <div className="space-y-4">
                  <Input value={taskTitle} placeholder="Add a Task" onChange={(e)=>setTaskTitle(e.target.value)} required className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none" />
                  <Input value={description} placeholder="There is something to do." onChange={(e)=>setDescription(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"/>
                  <Dropdown onSelect={(val)=>setPriority(val)}/>
                  <Button onClick={handleSubmit} loading={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition mt-20">Create</Button>
      </div>
    </Modal>
    </>
    
  )
}

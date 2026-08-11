"use client"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { socketClient } from "@/services/websocket/socketClient"
import { addList, removeList, updateList } from "@/features/lists/listSlice"
import { addTask, removeTask, removeTasksForList, updateTask } from "@/features/tasks/taskSlice"
import type { List } from "@/features/lists/listSlice"
import type { Task } from "@/features/tasks/taskSlice"
export function useWebSocket(workspaceId: string, token: string | null) {
  const dispatch = useDispatch()
  useEffect(() => {
    if (!token) return
    const socket = socketClient.connect(token)
    const join = () => socket.emit("workspace:join", { workspaceId })
    const onListCreated = (e:{workspaceId:string;list:List}) => { if(e.workspaceId===workspaceId) dispatch(addList(e.list)) }
    const onListUpdated = (e:{workspaceId:string;list:List}) => { if(e.workspaceId===workspaceId) dispatch(updateList({id:e.list.id,data:e.list})) }
    const onListDeleted = (e:{workspaceId:string;listId:string}) => { if(e.workspaceId===workspaceId) dispatch(removeList(e.listId)); dispatch(removeTasksForList(e.listId)) }
    const onTaskCreated = (e:{workspaceId:string;task:Task}) => { if(e.workspaceId===workspaceId) dispatch(addTask(e.task)) }
    const onTaskUpdated = (e:{workspaceId:string;task:Task}) => { if(e.workspaceId===workspaceId) dispatch(updateTask({id:e.task.id,data:e.task})) }
    const onTaskDeleted = (e:{workspaceId:string;taskId:string}) => { if(e.workspaceId===workspaceId) dispatch(removeTask(e.taskId)) }
    socket.on("connect", join); socket.on("list:created",onListCreated); socket.on("list:updated",onListUpdated); socket.on("list:deleted",onListDeleted); socket.on("task:created",onTaskCreated); socket.on("task:updated",onTaskUpdated); socket.on("task:moved",onTaskUpdated); socket.on("task:deleted",onTaskDeleted)
    if(socket.connected) join()
    return () => { socket.emit("workspace:leave",{workspaceId}); socket.off("connect",join); socket.off("list:created",onListCreated); socket.off("list:updated",onListUpdated); socket.off("list:deleted",onListDeleted); socket.off("task:created",onTaskCreated); socket.off("task:updated",onTaskUpdated); socket.off("task:moved",onTaskUpdated); socket.off("task:deleted",onTaskDeleted) }
  },[dispatch,token,workspaceId])
}

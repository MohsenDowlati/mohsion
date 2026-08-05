import { Task } from "@/types/task"

export default function TaskCard({ task }: { task: Task }) {

  const priority: string = task.priority === 'low' ? 'text-green-400' : (task.priority === 'medium' ? 'text-yellow-400' : 'text-red-400');

  return (
    <div className={`bg-gray-800 p-3 rounded-lg border border-gray-700 ${task.completed ? 'line-through' : ''}`}>
      <div className="flex justify-between text-sm" >
        <p>{task.title}</p>
        <span className={priority}>{task.priority}</span>
      </div>
      

      <div className="flex justify-between mt-2 text-xs">
        <p>{task.description}</p>
        
      </div>
      
    </div>
  )
}

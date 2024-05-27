import { StateCreator, create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import { immer } from "zustand/middleware/immer";

interface TaskState {
   draggingTaskId?: string | null;
   tasks: Record<string, Task>; // ( [key:string]: Task )
   getTaskByStatus: (status: TaskStatus) => Task[];
   addTask: (title: string, status: TaskStatus) => void;
   setDraggingTaskId: (taskId: string) => void;
   removeDraggingTaskId: () => void;
   changeTaskStatus: (taskId: string, status: TaskStatus) => void;
   onTaskDrop: (status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState, [["zustand/immer", never]]> = (set, get) => ({

   draggingTaskId: undefined,

   tasks: {
      'ABD-1': { id: 'ABD-1', title: 'Task 1', status: 'open' },
      'ABD-2': { id: 'ABD-2', title: 'Task 2', status: 'in-progress' },
      'ABD-3': { id: 'ABD-3', title: 'Task 3', status: 'open' },
      'ABD-4': { id: 'ABD-4', title: 'Task 4', status: 'open' },
   },

   getTaskByStatus: (status: TaskStatus) => {
      const tasks = get().tasks;
      return Object.values(tasks).filter((task: any) => task.status === status);
   },

   addTask: (title: string, status: TaskStatus) => {

      const newTask = { id: uuidv4(), title, status };

      set(state => {
         state.tasks[newTask.id] = newTask;
      })

      // Requiere npm install immer
      // set(produce((state:TaskState) => {
      //    state.tasks[newTask.id] = newTask;
      // }))      

      // Forma nativa de zustand
      // set( state =>  ({
      //    tasks: {
      //       ...state.tasks,
      //       [newTask.id]: newTask
      //    }
      // }))
   },

   setDraggingTaskId: (taskId: string) => {
      set({ draggingTaskId: taskId });
   },

   removeDraggingTaskId: () => {
      set({ draggingTaskId: undefined });
   },

   changeTaskStatus: (taskId: string, status: TaskStatus) => {

      // const task = get().tasks[taskId];
      // task.status = status;

      set(state => {
         state.tasks[taskId] = {
            ...state.tasks[taskId],
            status
         };
      })

      // set((state) => ({
      //    tasks: {
      //       ...state.tasks,
      //       [taskId]: task	
      //    }
      // }))

   },

   onTaskDrop: (status: TaskStatus) => {
      const taskId = get().draggingTaskId;
      if (!taskId) return;
      get().changeTaskStatus(taskId, status);
      get().removeDraggingTaskId();
   }

});

export const useTaskStore = create<TaskState>()(
   devtools(
      persist(
         immer(storeApi), 
         { name: "task-store" }
      ),
   )
);
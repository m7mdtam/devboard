import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Board, Column, Task, Priority } from "../types";

type BoardStore = {
  boards: Board[];
  columns: Column[];
  tasks: Task[];

  addBoard: (name: string) => void;
  updateBoard: (id: string, name: string) => void;
  deleteBoard: (id: string) => void;

  addColumn: (boardId: string, title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;

  addTask: (
    columnId: string,
    data: { title: string; description?: string; priority: Priority; dueDate?: string }
  ) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => void;
  reorderTasks: (columnId: string, tasks: Task[]) => void;
  reorderColumns: (boardId: string, columns: Column[]) => void;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      columns: [],
      tasks: [],

      addBoard: (name) => {
        const board: Board = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ boards: [...state.boards, board] }));
      },

      updateBoard: (id, name) => {
        set((state) => ({
          boards: state.boards.map((b) => (b.id === id ? { ...b, name } : b)),
        }));
      },

      deleteBoard: (id) => {
        const columnIds = get().columns
          .filter((c) => c.boardId === id)
          .map((c) => c.id);
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== id),
          columns: state.columns.filter((c) => c.boardId !== id),
          tasks: state.tasks.filter((t) => !columnIds.includes(t.columnId)),
        }));
      },

      addColumn: (boardId, title) => {
        const order = get().columns.filter((c) => c.boardId === boardId).length;
        const column: Column = {
          id: crypto.randomUUID(),
          boardId,
          title,
          order,
        };
        set((state) => ({ columns: [...state.columns, column] }));
      },

      updateColumn: (id, title) => {
        set((state) => ({
          columns: state.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        }));
      },

      deleteColumn: (id) => {
        set((state) => ({
          columns: state.columns.filter((c) => c.id !== id),
          tasks: state.tasks.filter((t) => t.columnId !== id),
        }));
      },

      addTask: (columnId, data) => {
        const order = get().tasks.filter((t) => t.columnId === columnId).length;
        const task: Task = {
          id: crypto.randomUUID(),
          columnId,
          order,
          ...data,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, data) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      moveTask: (taskId, newColumnId, newOrder) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: newColumnId, order: newOrder } : t
          ),
        }));
      },

      reorderTasks: (columnId, tasks) => {
        set((state) => ({
          tasks: [
            ...state.tasks.filter((t) => t.columnId !== columnId),
            ...tasks,
          ],
        }));
      },

      reorderColumns: (boardId, columns) => {
        set((state) => ({
          columns: [
            ...state.columns.filter((c) => c.boardId !== boardId),
            ...columns,
          ],
        }));
      },
    }),
    { name: "devboard-store" }
  )
);

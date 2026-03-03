export type Priority = "low" | "medium" | "high";

export type Board = {
  id: string;
  name: string;
  createdAt: string;
};

export type Column = {
  id: string;
  boardId: string;
  title: string;
  order: number;
};

export type Task = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  order: number;
};

export type BoardFormInput = {
  name: string;
};

export type TaskFormInput = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
};

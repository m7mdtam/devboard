import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task/task-card";
import { TaskFormModal } from "@/components/task/task-form-modal";
import type { Column, Task } from "@/types";
import { useBoardStore } from "@/store/use-board-store";
import type { TaskFormInput } from "@/components/task/task-form-modal";

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
}

export function BoardColumn(props: BoardColumnProps) {
  const addTask = useBoardStore((state) => state.addTask);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const { setNodeRef } = useDroppable({ id: props.column.id });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTask = (data: TaskFormInput) => {
    addTask(props.column.id, data);
    setShowForm(false);
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Delete column "${props.column.title}"?`)) {
      deleteColumn(props.column.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col rounded-2xl border border-border bg-linear-to-b bg-surface overflow-hidden"
    >
      <div className="p-4 border-b border-border bg-surface hover:bg-surface-raised transition-colors group">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-text line-clamp-1 flex-1">
            {props.column.title}
          </h3>
          <button
            onClick={handleDeleteColumn}
            className="cursor-pointer p-1 rounded opacity-0 group-hover:opacity-100 text-text-secondary hover:text-destructive hover:bg-destructive/10 transition-all"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <p className="text-xs text-secondary font-medium">
          {props.tasks.length} {props.tasks.length === 1 ? "Task" : "Tasks"}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96"
      >
        <SortableContext
          items={props.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {props.tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center h-48 text-center text-text-secondary"
            >
              <p className="text-sm">No tasks yet. Add one to get started!</p>
            </motion.div>
          ) : (
            props.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>

      <div className="p-4 border-t border-border bg-surface-raised">
        <Button
          variant="ghost"
          onClick={() => setShowForm(true)}
          className="w-full gap-2 cursor-pointer text-primary hover:bg-primary/10"
          type="button"
        >
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      <TaskFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleAddTask}
        task={editingTask}
        title={editingTask ? "Edit Task" : "Add New Task"}
        submitLabel={editingTask ? "Update" : "Add Task"}
      />
    </motion.div>
  );
}

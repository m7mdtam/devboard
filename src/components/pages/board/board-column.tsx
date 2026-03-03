import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TaskCard } from "./task-card";
import { TaskFormModal } from "./task-form-modal";
import { useBoardStore } from "@/store/use-board-store";
import type { Column, Task, TaskFormInput } from "@/types";

type BoardColumnProps = {
  column: Column;
  tasks: Task[];
};

export function BoardColumn(props: BoardColumnProps) {
  const addTask = useBoardStore((state) => state.addTask);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const { setNodeRef } = useDroppable({ id: props.column.id });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAddTask = (data: TaskFormInput) => {
    addTask(props.column.id, data);
    setIsAddTaskOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col rounded-2xl border border-border bg-linear-to-b bg-surface overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-surface hover:bg-surface-raised transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-text line-clamp-1 flex-1">
              {props.column.title}
            </h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsDeleteOpen(true)}
              className="cursor-pointer text-text-secondary hover:text-destructive hover:bg-destructive/10"
              type="button"
              aria-label="Delete column"
            >
              <Trash2 size={16} />
            </Button>
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
            onClick={() => setIsAddTaskOpen(true)}
            className="w-full gap-2 cursor-pointer text-primary hover:bg-primary/10"
            type="button"
          >
            <Plus size={18} />
            Add Task
          </Button>
        </div>
      </motion.div>

      <TaskFormModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
        title="Add New Task"
        submitLabel="Add Task"
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Column"
        description={`Are you sure you want to delete "${props.column.title}"? All tasks within it will be permanently removed.`}
        onConfirm={() => {
          deleteColumn(props.column.id);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}

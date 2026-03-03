import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddTask = (data: TaskFormInput) => {
    addTask(props.column.id, data);
    setShowForm(false);
  };

  const confirmDelete = () => {
    deleteColumn(props.column.id);
    setIsDeleteOpen(false);
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

    {isDesktop ? (
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Column</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{props.column.title}"? All tasks
            within it will be permanently removed.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes I'm Sure
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Sheet open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Delete Column</SheetTitle>
            <SheetDescription>
              Are you sure you want to delete "{props.column.title}"? All tasks
              within it will be permanently removed.
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Yes I'm Sure
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )}
    </>
  );
}

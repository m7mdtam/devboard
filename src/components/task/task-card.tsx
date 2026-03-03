/* eslint-disable react-hooks/refs */
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trash2, Pencil, Flag, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ElectricBorder from "@/components/ElectricBorder";
import {
  TaskFormModal,
  type TaskFormInput,
} from "@/components/task/task-form-modal";
import type { Task } from "@/types";
import { useBoardStore } from "@/store/use-board-store";

interface TaskCardProps {
  task: Task;
}

export function TaskCard(props: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const updateTask = useBoardStore((state) => state.updateTask);
  const sortable = useSortable({ id: props.task.id });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (data: TaskFormInput) => {
    updateTask(props.task.id, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
    });
  };

  const confirmDelete = () => {
    deleteTask(props.task.id);
    setIsDeleteDialogOpen(false);
  };

  const priorityVariant =
    props.task.priority === "low"
      ? "secondary"
      : props.task.priority === "medium"
        ? "outline"
        : "destructive";

  const electricBorderColor = {
    high: "#D92d3f", // red
    medium: "#FFA500", // orange
    low: "#7b8fc9", // blue
  }[props.task.priority];

  const cardContent = (
    <div
      className="group relative p-3 sm:p-4 rounded-lg bg-surface transition-shadow duration-200 cursor-grab active:cursor-grabbing pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-text flex-1 line-clamp-2">
            {props.task.title}
          </h4>

          <div className="flex gap-0.5 shrink-0 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleEdit}
              className="cursor-pointer text-text-secondary hover:text-secondary hover:bg-secondary/10 pointer-events-auto"
              type="button"
              aria-label="Edit task"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Pencil size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="cursor-pointer text-text-secondary hover:text-destructive hover:bg-destructive/10 pointer-events-auto"
              type="button"
              aria-label="Delete task"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        {props.task.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {props.task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <Badge variant={priorityVariant}>
            <Flag size={12} />
            {props.task.priority.charAt(0).toUpperCase() +
              props.task.priority.slice(1)}
          </Badge>

          {props.task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Calendar size={12} />
              {new Date(props.task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const showElectric = isHovered;

  return (
    <>
      <div
        ref={sortable.setNodeRef}
        style={{
          transform: CSS.Transform.toString(sortable.transform),
          transition: sortable.transition,
          zIndex: sortable.isDragging ? 9999 : 0,
          position: sortable.isDragging ? "relative" : "static",
          opacity: sortable.isDragging ? 1 : undefined,
        }}
        {...sortable.attributes}
        {...sortable.listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ opacity: sortable.isDragging ? 1 : 1 }}
        >
          {showElectric ? (
            <ElectricBorder
              color={electricBorderColor}
              speed={0.5}
              chaos={0.05}
              borderRadius={8}
            >
              {cardContent}
            </ElectricBorder>
          ) : (
            <div className="rounded-lg border border-border/60">
              {cardContent}
            </div>
          )}
        </motion.div>
      </div>

      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        task={props.task}
        title="Edit Task"
        submitLabel="Save Changes"
      />

      {isDesktop ? (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{props.task.title}"? This action
              cannot be undone.
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
        <Sheet open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader className="mb-6">
              <SheetTitle>Delete Task</SheetTitle>
              <SheetDescription>
                Are you sure you want to delete "{props.task.title}"? This
                action cannot be undone.
              </SheetDescription>
            </SheetHeader>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes I'm Sure
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

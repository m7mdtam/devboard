/* eslint-disable react-hooks/refs */
import { useState } from "react";
import { motion } from "motion/react";
import { Trash2, Pencil, Flag, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import ElectricBorder from "@/components/ElectricBorder";
import { TaskFormModal } from "./task-form-modal";
import { useBoardStore } from "@/store/use-board-store";
import { PRIORITY_ELECTRIC_COLORS } from "@/constants";
import type { Task, TaskFormInput } from "@/types";

type TaskCardProps = {
  task: Task;
};

const PRIORITY_BADGE_VARIANT: Record<Task["priority"], "secondary" | "outline" | "destructive"> = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
};

export function TaskCard(props: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const updateTask = useBoardStore((state) => state.updateTask);
  const sortable = useSortable({ id: props.task.id });

  const handleEditSubmit = (data: TaskFormInput) => {
    updateTask(props.task.id, data);
  };

  const cardContent = (
    <div
      className="group relative p-3 sm:p-4 rounded-lg bg-surface transition-shadow duration-200 cursor-grab active:cursor-grabbing pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-text flex-1 line-clamp-2">{props.task.title}</h4>

          <div className="flex gap-0.5 shrink-0 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
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
                setIsDeleteOpen(true);
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
          <p className="text-xs text-text-secondary line-clamp-2">{props.task.description}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <Badge variant={PRIORITY_BADGE_VARIANT[props.task.priority]}>
            <Flag size={12} />
            {props.task.priority.charAt(0).toUpperCase() + props.task.priority.slice(1)}
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

  return (
    <>
      <div
        ref={sortable.setNodeRef}
        style={{
          transform: CSS.Transform.toString(sortable.transform),
          transition: sortable.transition,
          zIndex: sortable.isDragging ? 9999 : 0,
          position: sortable.isDragging ? "relative" : "static",
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
        >
          {isHovered ? (
            <ElectricBorder
              color={PRIORITY_ELECTRIC_COLORS[props.task.priority]}
              speed={0.5}
              chaos={0.05}
              borderRadius={8}
            >
              {cardContent}
            </ElectricBorder>
          ) : (
            <div className="rounded-lg border border-border/60">{cardContent}</div>
          )}
        </motion.div>
      </div>

      <TaskFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        task={props.task}
        title="Edit Task"
        submitLabel="Save Changes"
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${props.task.title}"? This action cannot be undone.`}
        onConfirm={() => {
          deleteTask(props.task.id);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}

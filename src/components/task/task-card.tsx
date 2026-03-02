/* eslint-disable react-hooks/refs */
import { motion } from "motion/react";
import { Trash2, Flag, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";
import { useBoardStore } from "@/store/use-board-store";

interface TaskCardProps {
  task: Task;
}

export function TaskCard(props: TaskCardProps) {
  const store = useBoardStore();
  const sortable = useSortable({ id: props.task.id });

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    store.deleteTask(props.task.id);
  };

  const priorityVariant =
    props.task.priority === "low"
      ? "ghost"
      : props.task.priority === "medium"
        ? "secondary"
        : "destructive";

  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{ opacity: sortable.isDragging ? 0.5 : 1 }}
        className="group relative p-3 sm:p-4 rounded-lg border border-border bg-surface hover:border-primary hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      >
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-text flex-1 line-clamp-2">
              {props.task.title}
            </h4>
            <button
              onClick={handleDelete}
              className="shrink-0 p-1 rounded text-text-secondary hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
              type="button"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
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
      </motion.div>
    </div>
  );
}

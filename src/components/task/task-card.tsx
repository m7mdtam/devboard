/* eslint-disable react-hooks/refs */
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Trash2, Pencil, Flag, Calendar, Check, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ElectricBorder from "@/components/ElectricBorder";
import type { Task } from "@/types";
import { useBoardStore } from "@/store/use-board-store";

interface TaskCardProps {
  task: Task;
}

export function TaskCard(props: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(props.task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const sortable = useSortable({ id: props.task.id });

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(props.task.title);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleSave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // TODO: Add update task functionality
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditTitle(props.task.title);
    setIsEditing(false);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteTask(props.task.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
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
      className="group relative p-3 sm:p-4 rounded-lg bg-surface transition-shadow duration-200 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="text-sm"
              />
            ) : (
              <h4 className="text-sm font-medium text-text flex-1 line-clamp-2">
                {props.task.title}
              </h4>
            )}
          </div>

          <div className="flex gap-0.5 shrink-0">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSave}
                  className="cursor-pointer text-primary hover:bg-primary/10"
                  type="button"
                  aria-label="Save"
                >
                  <Check size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCancel}
                  className="cursor-pointer text-text-secondary hover:text-text"
                  type="button"
                  aria-label="Cancel"
                >
                  <X size={18} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleEdit}
                  className="cursor-pointer text-text-secondary hover:text-secondary hover:bg-secondary/10"
                  type="button"
                  aria-label="Edit task"
                >
                  <Pencil size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDelete}
                  className="cursor-pointer text-text-secondary hover:text-destructive hover:bg-destructive/10"
                  type="button"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </Button>
              </>
            )}
          </div>
        </div>

        {!isEditing && props.task.description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {props.task.description}
          </p>
        )}

        {!isEditing && (
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
        )}
      </div>
    </div>
  );

  const showElectric = isHovered || isEditing;

  return (
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
  );
}

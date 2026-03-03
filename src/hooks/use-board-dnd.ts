import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useBoardStore } from "@/store/use-board-store";
import type { Column, Task } from "@/types";

export function useBoardDnd(boardColumns: Column[], boardTasks: Task[]) {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const moveTask = useBoardStore((state) => state.moveTask);
  const reorderTasks = useBoardStore((state) => state.reorderTasks);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = boardTasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumn = boardColumns.find((c) => c.id === over.id);
    const overTask = boardTasks.find((t) => t.id === over.id);

    if (overColumn) {
      const columnTasks = boardTasks.filter(
        (t) => t.columnId === overColumn.id
      );
      moveTask(activeTask.id, overColumn.id, columnTasks.length);
    } else if (overTask) {
      const columnTasks = boardTasks
        .filter((t) => t.columnId === overTask.columnId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnTasks.findIndex((t) => t.id === activeTask.id);
      const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);

      if (activeTask.columnId === overTask.columnId) {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex);
        reorderTasks(
          activeTask.columnId,
          reordered.map((t, i) => ({ ...t, order: i }))
        );
      } else {
        const targetColumnTasks = boardTasks
          .filter((t) => t.columnId === overTask.columnId)
          .sort((a, b) => a.order - b.order);
        const insertIndex = Math.min(newIndex, targetColumnTasks.length);
        moveTask(activeTask.id, overTask.columnId, insertIndex);
      }
    }
  };

  return { activeId, handleDragStart, handleDragCancel, handleDragEnd };
}

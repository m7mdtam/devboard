import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, ArrowLeft } from "lucide-react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BoardColumn } from "@/components/column/board-column";
import { PageSection } from "@/components/shared/page-section";
import { useBoardStore } from "@/store/use-board-store";

const BoardPage = () => {
  const params = useParams({ from: "/_app/board/$boardId" });
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const columns = useBoardStore((state) => state.columns);
  const tasks = useBoardStore((state) => state.tasks);
  const addColumn = useBoardStore((state) => state.addColumn);
  const moveTask = useBoardStore((state) => state.moveTask);
  const reorderTasks = useBoardStore((state) => state.reorderTasks);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const board = boards.find((b) => b.id === params.boardId);
  const boardColumns = columns
    .filter((c) => c.boardId === params.boardId)
    .sort((a, b) => a.order - b.order);
  const boardTasks = tasks.filter((t) =>
    boardColumns.some((c) => c.id === t.columnId),
  );

  if (!board) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-text mb-2">Board not found</h1>
          <Button onClick={() => navigate({ to: "/" })}>Go back home</Button>
        </div>
      </div>
    );
  }

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnName.trim()) {
      addColumn(params.boardId, newColumnName);
      setNewColumnName("");
      setShowAddColumn(false);
    }
  };

  const handleDragEnd = (event: {
    active: { id: string | number };
    over: { id: string | number } | null;
  }) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = boardTasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumn = boardColumns.find((c) => c.id === over.id);
    const overTask = boardTasks.find((t) => t.id === over.id);

    if (overColumn) {
      const columnTasks = boardTasks.filter(
        (t) => t.columnId === overColumn.id,
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
          reordered.map((t, i) => ({ ...t, order: i })),
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

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-2 sm:space-y-4 md:space-y-6 pt-4 sm:pt-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="text-text-secondary hover:text-text gap-2"
            type="button"
          >
            <ArrowLeft size={24} />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-1 sm:mb-2">
            {board.name}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Manage your tasks and projects
          </p>
        </motion.div>

        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveId(event.active.id)}
          onDragCancel={() => setActiveId(null)}
          collisionDetection={closestCorners}
        >
          <PageSection>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 pb-4 auto-rows-max"
            >
              {boardColumns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  tasks={boardTasks
                    .filter((t) => t.columnId === column.id)
                    .sort((a, b) => a.order - b.order)}
                />
              ))}

              {showAddColumn ? (
                <motion.form
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleAddColumn}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-border bg-surface-raised flex flex-col gap-2"
                >
                  <Label
                    htmlFor="column-name"
                    className="text-sm font-medium text-text"
                  >
                    Column name
                  </Label>
                  <Input
                    id="column-name"
                    autoFocus
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.currentTarget.value)}
                    placeholder="e.g., To Do"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowAddColumn(false);
                        setNewColumnName("");
                      }
                    }}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddColumn(false);
                        setNewColumnName("");
                      }}
                      className="flex-1"
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="flex-1" type="submit">
                      Add
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowAddColumn(true)}
                  className="w-full h-fit p-4 rounded-2xl border border-dashed border-border hover:border-primary hover:bg-surface-raised transition-all group cursor-pointer"
                  type="button"
                >
                  <div className="flex items-center justify-center gap-2 text-text-secondary group-hover:text-primary transition-colors">
                    <Plus size={20} />
                    <span className="font-medium text-sm">Add Column</span>
                  </div>
                </motion.button>
              )}
            </motion.div>
          </PageSection>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 pointer-events-none">
                {(() => {
                  const draggingTask = boardTasks.find(
                    (t) => t.id === activeId,
                  );
                  if (!draggingTask) return null;
                  return (
                    <div className="p-4 rounded-xl border border-border bg-surface cursor-grabbing shadow-lg shadow-primary/30 w-64 max-w-xs">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-text text-sm leading-tight flex-1 line-clamp-2">
                          {draggingTask.title}
                        </h4>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardPage;

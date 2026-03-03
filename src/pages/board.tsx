import { useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { BoardColumn } from "@/components/pages/board/board-column";
import { ColumnForm } from "@/components/pages/board/column-form";
import { PageSection } from "@/components/shared/page-section";
import { useBoardStore } from "@/store/use-board-store";
import { useBoardDnd } from "@/hooks/use-board-dnd";

const BoardPage = () => {
  const params = useParams({ from: "/_app/board/$boardId" });
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const columns = useBoardStore((state) => state.columns);
  const tasks = useBoardStore((state) => state.tasks);

  const board = boards.find((b) => b.id === params.boardId);
  const boardColumns = columns
    .filter((c) => c.boardId === params.boardId)
    .sort((a, b) => a.order - b.order);
  const boardTasks = tasks.filter((t) => boardColumns.some((c) => c.id === t.columnId));

  const { activeId, handleDragStart, handleDragCancel, handleDragEnd } = useBoardDnd(
    boardColumns,
    boardTasks
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

  const activeTask = boardTasks.find((t) => t.id === activeId);

  return (
    <div className="min-h-dvh">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-2 sm:space-y-4 md:space-y-6 pt-4 sm:pt-6">
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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-1 sm:mb-2">
            {board.name}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">Manage your tasks and projects</p>
        </motion.div>

        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
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
              <ColumnForm boardId={params.boardId} />
            </motion.div>
          </PageSection>

          <DragOverlay>
            {activeTask ? (
              <div className="opacity-80 pointer-events-none">
                <div className="p-4 rounded-xl border border-border bg-surface cursor-grabbing shadow-lg shadow-primary/30 w-64 max-w-xs">
                  <h4 className="font-semibold text-text text-sm leading-tight line-clamp-2">
                    {activeTask.title}
                  </h4>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardPage;

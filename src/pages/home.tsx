import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useBoardStore } from "@/store/use-board-store";
import { BoardForm } from "@/components/pages/home/board-form";
import { BoardCard } from "@/components/pages/home/board-card";
import { PageSection } from "@/components/shared/page-section";
import type { BoardFormInput } from "@/types";

const HomePage = () => {
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const addBoard = useBoardStore((state) => state.addBoard);

  const handleCreateBoard = (data: BoardFormInput) => {
    addBoard(data.name);
  };

  return (
    <div className="min-h-dvh pt-8 sm:pt-12 md:pt-16">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-1 sm:mb-2">
            Your Boards
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Create and manage your projects with ease
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PageSection>
            <BoardForm onSubmit={handleCreateBoard} />
          </PageSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <PageSection>
            {boards.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <p className="text-xs sm:text-sm text-text-secondary">
                  No boards yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {boards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() =>
                      navigate({
                        to: "/board/$boardId",
                        params: { boardId: board.id },
                      })
                    }
                  />
                ))}
              </div>
            )}
          </PageSection>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

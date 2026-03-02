import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoardStore } from "@/store/use-board-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .min(3, "Must be at least 3 characters"),
});

type CreateBoardInput = z.infer<typeof createBoardSchema>;

const HomePage = () => {
  const navigate = useNavigate();
  const store = useBoardStore();
  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
  });

  const handleSubmit = (data: CreateBoardInput) => {
    store.addBoard(data.name);
    form.reset();
  };

  const handleBoardClick = (boardId: string) => {
    navigate({ to: "/board/$boardId", params: { boardId } });
  };

  const handleDelete = (boardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    store.deleteBoard(boardId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-dvh bg-background pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Your Boards</h1>
          <p className="text-text-secondary">
            Create and manage your projects with ease
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 p-6 rounded-2xl border border-border bg-surface hover:border-primary transition-colors"
        >
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label
                htmlFor="board-name"
                className="block text-sm font-medium text-text mb-2"
              >
                Create New Board
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="board-name"
                  type="text"
                  placeholder="Enter board name..."
                  {...form.register("name")}
                  className="flex-1"
                />
                <Button type="submit" className="gap-2 sm:w-auto">
                  <Plus size={18} />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </div>
              {form.formState.errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </form>
        </motion.div>

        {store.boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus size={32} className="text-primary" />
            </div>
            <p className="text-text-secondary text-lg">
              No boards yet. Create one to get started!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {store.boards.map((board) => (
              <motion.div
                key={board.id}
                variants={itemVariants}
                className="group relative p-6 rounded-2xl border border-border bg-surface hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleBoardClick(board.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                        {board.name}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {new Date(board.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(board.id, e)}
                      className="p-2 rounded-lg text-text-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
                      type="button"
                      aria-label="Delete board"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"
                        style={{ opacity: 1 - index * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

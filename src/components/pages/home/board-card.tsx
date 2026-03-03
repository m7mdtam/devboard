import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import ElectricBorder from "@/components/ElectricBorder";
import { useBoardStore } from "@/store/use-board-store";
import { BOARD_ELECTRIC_COLOR } from "@/constants";
import type { Board } from "@/types";

type BoardCardProps = {
  board: Board;
  onClick: () => void;
};

export function BoardCard(props: BoardCardProps) {
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(props.board.name);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(props.board.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleSave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const trimmed = editName.trim();
    if (trimmed.length >= 1) {
      updateBoard(props.board.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditName(props.board.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  const cardInner = (
    <div
      className="group relative p-4 sm:p-5 rounded-2xl bg-surface transition-shadow duration-300 overflow-hidden"
      onClick={isEditing ? undefined : props.onClick}
      style={{ cursor: isEditing ? "default" : "pointer" }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <h4 className="text-base sm:text-lg font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                {props.board.name}
              </h4>
            )}
            <p className="text-xs text-text-secondary mt-1">
              {new Date(props.board.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-0.5 shrink-0">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSave}
                  className="text-primary hover:bg-primary/10"
                  type="button"
                  aria-label="Save"
                >
                  <Check size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCancel}
                  className="text-text-secondary hover:text-text"
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
                  aria-label="Edit board"
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
                  className="cursor-pointer text-text-secondary hover:text-destructive hover:bg-destructive/10"
                  type="button"
                  aria-label="Delete board"
                >
                  <Trash2 size={18} />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 sm:h-1 rounded-full bg-linear-to-r from-primary to-secondary"
              style={{ opacity: 1 - index * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered || isEditing ? (
          <ElectricBorder color={BOARD_ELECTRIC_COLOR} borderRadius={16}>
            {cardInner}
          </ElectricBorder>
        ) : (
          <div className="rounded-2xl border border-border/60">{cardInner}</div>
        )}
      </motion.div>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Board"
        description={`Are you sure you want to delete "${props.board.name}"? This will delete all columns and tasks within it.`}
        onConfirm={() => {
          deleteBoard(props.board.id);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}

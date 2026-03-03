import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoardStore } from "@/store/use-board-store";

type ColumnFormProps = {
  boardId: string;
};

export function ColumnForm(props: ColumnFormProps) {
  const addColumn = useBoardStore((state) => state.addColumn);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addColumn(props.boardId, name.trim());
      setName("");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setName("");
  };

  if (isOpen) {
    return (
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
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
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="e.g., To Do"
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel();
          }}
        />
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
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
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => setIsOpen(true)}
      className="w-full h-fit p-4 rounded-2xl border border-dashed border-border hover:border-primary hover:bg-surface-raised transition-all group cursor-pointer"
      type="button"
    >
      <div className="flex items-center justify-center gap-2 text-text-secondary group-hover:text-primary transition-colors">
        <Plus size={20} />
        <span className="font-medium text-sm">Add Column</span>
      </div>
    </motion.button>
  );
}

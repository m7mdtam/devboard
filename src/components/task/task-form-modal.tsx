import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Task } from "@/types";

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormInput) => void;
  task?: Task;
  title: string;
  submitLabel?: string;
}

export function TaskFormModal(props: TaskFormModalProps) {
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: props.task
      ? {
          title: props.task.title,
          description: props.task.description || "",
          priority: props.task.priority,
          dueDate: props.task.dueDate || "",
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
        },
  });

  const handleFormSubmit = (data: TaskFormInput) => {
    props.onSubmit(data);
    form.reset();
    props.onClose();
  };

  if (!props.isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-md p-4"
      onClick={props.onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md p-6 rounded-2xl bg-surface border border-border shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={props.onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-border transition-colors"
          type="button"
        >
          <X size={20} className="text-text-secondary" />
        </button>

        <h2 className="text-xl font-bold text-text mb-4">{props.title}</h2>

        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div>
            <Label
              htmlFor="title"
              className="block text-sm font-medium text-text mb-2"
            >
              Task Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="What needs to be done?"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-text mb-2"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              {...form.register("description")}
            />
          </div>

          <div>
            <Label
              htmlFor="priority"
              className="block text-sm font-medium text-text mb-2"
            >
              Priority
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border hover:border-primary cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    value={priority}
                    {...form.register("priority")}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm font-medium text-text capitalize">
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label
              htmlFor="dueDate"
              className="block text-sm font-medium text-text mb-2"
            >
              Due Date (Optional)
            </Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={props.onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {props.submitLabel || "Create Task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

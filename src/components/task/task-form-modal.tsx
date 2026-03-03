import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
          dueDate: new Date().toISOString().split("T")[0],
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
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={props.onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text"
          type="button"
        >
          <X size={18} />
        </Button>

        <h2 className="text-xl font-bold text-text mb-4">{props.title}</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="What needs to be done?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <Label
                          key={priority}
                          htmlFor={`priority-${priority}`}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all font-normal",
                            field.value === priority
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary text-text",
                          )}
                        >
                          <RadioGroupItem
                            value={priority}
                            id={`priority-${priority}`}
                          />
                          <span className="text-sm font-medium capitalize">
                            {priority}
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={props.onClose}
                className="flex-1"
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {props.submitLabel || "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
}

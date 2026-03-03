import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { TaskForm } from "./task-form";
import { taskSchema } from "@/schemas/task.schema";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import type { Task, TaskFormInput } from "@/types";

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormInput) => void;
  task?: Task;
  title: string;
  submitLabel?: string;
};

export function TaskFormModal(props: TaskFormModalProps) {
  const isDesktop = useIsDesktop();

  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: props.task
      ? {
          title: props.task.title,
          description: props.task.description ?? "",
          priority: props.task.priority,
          dueDate: props.task.dueDate ?? "",
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          dueDate: new Date().toISOString().split("T")[0],
        },
  });

  useEffect(() => {
    if (props.isOpen && props.task) {
      form.reset({
        title: props.task.title,
        description: props.task.description ?? "",
        priority: props.task.priority,
        dueDate: props.task.dueDate ?? "",
      });
    } else if (props.isOpen && !props.task) {
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [props.isOpen, props.task, form]);

  const handleSubmit = (data: TaskFormInput) => {
    props.onSubmit(data);
    form.reset();
    props.onClose();
  };

  if (!props.isOpen) return null;

  if (!isDesktop) {
    return (
      <Drawer open={props.isOpen} onOpenChange={props.onClose}>
        <DrawerContent className="bg-surface border-t border-border">
          <DrawerHeader className="flex items-center justify-between px-4 pt-4 pb-2">
            <DrawerTitle className="text-xl font-bold text-text">
              {props.title}
            </DrawerTitle>
            <DrawerClose className="opacity-0 pointer-events-none" />
          </DrawerHeader>
          <div className="px-4 pb-6 max-h-[80vh] overflow-y-auto">
            <TaskForm
              form={form}
              onSubmit={handleSubmit}
              onCancel={props.onClose}
              submitLabel={props.submitLabel ?? "Create Task"}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

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
        <TaskForm
          form={form}
          onSubmit={handleSubmit}
          onCancel={props.onClose}
          submitLabel={props.submitLabel ?? "Create Task"}
        />
      </motion.div>
    </motion.div>
  );
}

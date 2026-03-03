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
import { PRIORITY_VALUES } from "@/constants";
import type { UseFormReturn } from "react-hook-form";
import type { TaskFormInput } from "@/types";

type TaskFormProps = {
  form: UseFormReturn<TaskFormInput>;
  onSubmit: (data: TaskFormInput) => void;
  onCancel: () => void;
  submitLabel: string;
};

export function TaskForm(props: TaskFormProps) {
  return (
    <Form {...props.form}>
      <form
        onSubmit={props.form.handleSubmit(props.onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={props.form.control}
          name="title"
          render={(renderData) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="What needs to be done?"
                  {...renderData.field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={props.form.control}
          name="description"
          render={(renderData) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add more details..."
                  {...renderData.field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={props.form.control}
          name="priority"
          render={(renderData) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={renderData.field.onChange}
                  value={renderData.field.value}
                  className="grid grid-cols-3 gap-2"
                >
                  {PRIORITY_VALUES.map((priority) => (
                    <Label
                      key={priority}
                      htmlFor={`priority-${priority}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all font-normal",
                        renderData.field.value === priority
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary text-text"
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
          control={props.form.control}
          name="dueDate"
          render={(renderData) => (
            <FormItem>
              <FormLabel>Due Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...renderData.field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={props.onCancel}
            className="flex-1"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {props.submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { boardSchema } from "@/schemas/board.schema";
import type { BoardFormInput } from "@/types";

type BoardFormProps = {
  onSubmit: (data: BoardFormInput) => void;
};

export function BoardForm(props: BoardFormProps) {
  const form = useForm<BoardFormInput>({
    resolver: zodResolver(boardSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = (data: BoardFormInput) => {
    props.onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3 sm:gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={(renderData) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm font-medium text-text">
                Create New Board
              </FormLabel>
              <div className="flex flex-col sm:flex-row gap-2">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter board name..."
                    {...renderData.field}
                  />
                </FormControl>
                <Button
                  type="submit"
                  className="w-full sm:w-auto gap-2 cursor-pointer"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </div>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

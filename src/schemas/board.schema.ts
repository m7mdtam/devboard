import { z } from "zod";

export const boardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .min(3, "Must be at least 3 characters"),
});

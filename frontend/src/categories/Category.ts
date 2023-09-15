import { z } from "zod";

export interface Category {
  uuid?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MutateCategory = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export type MutateCategory = z.infer<typeof MutateCategory>

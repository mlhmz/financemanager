import { z } from "zod";
import type { Transaction } from "../transactions/Transaction";

export interface Sheet {
	uuid?: string;
	title?: string;
	createdAt?: string;
	updatedAt?: string;
	transactions?: Transaction[];
}

export interface SheetStats {
	sum?: number;
}

export const MutateSheet = z.object({
	title: z.string(),
});

export type MutateSheet = z.infer<typeof MutateSheet>;

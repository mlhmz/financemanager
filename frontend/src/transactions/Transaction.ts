import { z } from "zod";
import { Category } from "../categories/Category";

export interface Transaction {
	uuid?: string;
	title?: string;
	description?: string;
	amount?: number;
	timestamp?: string;
	createdAt?: string;
	updatedAt?: string;
	category?: Category;
	sheet?: TransactionSheet;
}

export interface TransactionSheet {
	uuid?: string;
	title?: string;
}

export const MutateTransaction = z.object({
	title: z.string(),
	description: z.string().optional(),
	amount: z.number(),
	timestamp: z.date(),
	sheetId: z.string().uuid(),
	categoryId: z.string().uuid(),
});

export type MutateTransaction = z.infer<typeof MutateTransaction>;

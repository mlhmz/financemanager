import { Category } from "../categories/Category";

export interface Transaction {
  uuid?: string,
  title?: string,
  description?: string,
  amount?: number,
  timestamp?: string,
  createdAt?: string,
  updatedAt?: string,
  category?: Category,
}
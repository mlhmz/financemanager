import { Transaction } from "../transactions/Transaction";

export interface Sheet {
  uuid?: string,
  title?: string,
  createdAt?: string,
  updatedAt?: string,
  transactions?: Transaction[]
}
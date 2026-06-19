import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount));
}

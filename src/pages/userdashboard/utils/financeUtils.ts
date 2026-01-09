import type { Transaction } from "./types";

/**
 * Calculates the total outstanding amount from a list of transactions.
 * Includes transactions with status "Open" or "Overdue".
 */
export const calculateOutstandingAmount = (transactions: Transaction[]): number => {
    return transactions
        .filter((t) => t.status === "Open" || t.status === "Overdue")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

/**
 * Calculates deposits from transactions.
 * (Placeholder logic, can be refined based on category)
 */
export const calculateDeposits = (transactions: Transaction[]): number => {
    return transactions
        .filter((t) => t.category === "Deposit" && t.status === "Paid")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

/**
 * Calculates credits from transactions.
 * (Placeholder logic, can be refined based on category)
 */
export const calculateCredits = (transactions: Transaction[]): number => {
    return transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
};

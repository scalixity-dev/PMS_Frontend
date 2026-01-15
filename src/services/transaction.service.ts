import { API_ENDPOINTS } from '../config/api.config';

export interface BackendTransaction {
  id: string;
  transactionId: string;
  managerId: string;
  type: 'INCOME' | 'EXPENSE' | 'DEPOSIT' | 'CREDIT' | 'INVOICE';
  scope: 'PROPERTY' | 'GENERAL';
  status: 'PENDING' | 'PAID' | 'VOID' | 'PARTIALLY_PAID' | 'REFUNDED';
  amount: string;
  balance: string;
  discount: string;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  category?: string | null;
  subcategory?: string | null;
  transactionDate: string;
  dueDate?: string | null;
  paidDate?: string | null;
  payerId?: string | null;
  payeeId?: string | null;
  contactId?: string | null;
  propertyId?: string | null;
  unitId?: string | null;
  leaseId?: string | null;
  details?: string | null;
  notes?: string | null;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  payer?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  payee?: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  property?: {
    id: string;
    propertyName: string;
  } | null;
  unit?: {
    id: string;
    unitName: string;
  } | null;
  lease?: {
    id: string;
    status: string;
  } | null;
  tags?: Array<{
    id: string;
    tag: string;
  }>;
  attachments?: Array<{
    id: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
  }>;
}

export interface CreateIncomeInvoiceDto {
  scope: 'PROPERTY' | 'GENERAL';
  category?: string;
  subcategory?: string;
  dueDate?: string;
  amount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  isPaid?: boolean;
  payerId?: string;
  contactId?: string;
  propertyId?: string;
  unitId?: string;
  leaseId?: string;
  details?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateExpenseInvoiceDto {
  scope: 'PROPERTY' | 'GENERAL';
  category?: string;
  subcategory?: string;
  dueDate?: string;
  amount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  isPaid?: boolean;
  payeeId?: string;
  contactId?: string;
  propertyId?: string;
  unitId?: string;
  leaseId?: string;
  details?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateDepositDto {
  scope: 'PROPERTY' | 'GENERAL';
  category?: string;
  subcategory?: string;
  dueDate?: string;
  amount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  isPaid?: boolean;
  paymentMethod?: string;
  payerId?: string;
  contactId?: string;
  propertyId?: string;
  unitId?: string;
  leaseId?: string;
  details?: string;
  tags?: string[];
  notes?: string;
}

export interface CreateRecurringIncomeDto {
  scope: 'PROPERTY' | 'GENERAL';
  category?: string;
  subcategory?: string;
  startDate: string;
  endDate?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'EVERY_TWO_WEEKS' | 'EVERY_FOUR_WEEKS' | 'MONTHLY' | 'EVERY_TWO_MONTHS' | 'QUARTERLY' | 'EVERY_SIX_MONTHS' | 'YEARLY';
  amount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  payerId?: string;
  contactId?: string;
  propertyId?: string;
  unitId?: string;
  leaseId?: string;
  details?: string;
  notes?: string;
}

class TransactionService {
  /**
   * Create an income invoice
   */
  async createIncomeInvoice(
    invoiceData: CreateIncomeInvoiceDto,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    // Add all fields to form data
    Object.entries(invoiceData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For arrays (like tags), join with comma or send as multiple entries
          formData.append(key, value.join(','));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(API_ENDPOINTS.TRANSACTION.CREATE_INCOME_INVOICE, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create income invoice';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Income invoice creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create income invoice: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Create an expense invoice
   */
  async createExpenseInvoice(
    invoiceData: CreateExpenseInvoiceDto,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    // Add all fields to form data
    Object.entries(invoiceData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For arrays (like tags), join with comma or send as multiple entries
          formData.append(key, value.join(','));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(API_ENDPOINTS.TRANSACTION.CREATE_EXPENSE_INVOICE, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create expense invoice';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Expense invoice creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create expense invoice: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Create a deposit transaction
   */
  async createDeposit(
    depositData: CreateDepositDto,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    // Add all fields to form data
    Object.entries(depositData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For arrays (like tags), join with comma or send as multiple entries
          formData.append(key, value.join(','));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(API_ENDPOINTS.TRANSACTION.CREATE_DEPOSIT, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create deposit';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Deposit creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create deposit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Create a recurring income transaction
   */
  async createRecurringIncome(
    recurringData: CreateRecurringIncomeDto,
  ): Promise<any> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.CREATE_RECURRING_INCOME, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(recurringData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create recurring income';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Recurring income creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create recurring income: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.recurringTransaction;
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.GET_TAGS, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch tags';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch tags: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.tags || [];
  }

  /**
   * Get all payments
   */
  async getPayments(): Promise<Payment[]> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.GET_PAYMENTS, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch payments';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch payments: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.payments || [];
  }

  /**
   * Get all transactions
   */
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.GET_ALL, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch transactions';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch transactions: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.transactions || [];
  }

  /**
   * Get all recurring transactions
   */
  async getRecurringTransactions(): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.GET_RECURRING, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch recurring transactions';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch recurring transactions: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.recurringTransactions || [];
  }

  /**
   * Mark a transaction as paid
   */
  async markAsPaid(transactionId: string, data: MarkAsPaidDto, file?: File): Promise<BackendTransaction> {
    const formData = new FormData();
    formData.append('datePaid', data.datePaid);
    formData.append('amountPaid', data.amountPaid.toString());
    formData.append('method', data.method);
    if (data.paymentDetails) {
      formData.append('paymentDetails', data.paymentDetails);
    }
    if (data.referenceNumber) {
      formData.append('referenceNumber', data.referenceNumber);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(API_ENDPOINTS.TRANSACTION.MARK_AS_PAID(transactionId), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to mark transaction as paid';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        errorMessage = `Failed to mark transaction as paid: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.DELETE(transactionId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete transaction');
    }
  }
}

export interface Transaction {
  id: string;
  status: 'Paid' | 'Pending' | 'Void';
  dueDate: string;
  date: string;
  category: string;
  property: string;
  contact: string;
  total: number;
  balance: number;
  type: 'income' | 'expense' | 'refund';
  transactionType: string;
  currency: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  status: 'Success' | 'Failed' | 'Pending';
  datePaid: string | Date;
  category: string;
  property: string;
  contact: string;
  amount: number;
  type: 'income' | 'expense' | 'refund';
  transactionType: string;
  currency: string;
  paymentMethod: string | null;
  referenceNumber: string | null;
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string | Date;
    method: string;
    referenceNumber: string | null;
    notes: string | null;
  }>;
}

export interface MarkAsPaidDto {
  datePaid: string; // ISO date string
  amountPaid: number;
  method: string;
  paymentDetails?: string;
  referenceNumber?: string;
  notes?: string;
}

export const transactionService = new TransactionService();

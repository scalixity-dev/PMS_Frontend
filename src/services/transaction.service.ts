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
    middleName?: string | null;
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
  payments?: Array<{
    id: string;
    amount: string;
    paymentDate: Date | string;
    method: string;
    paymentDetails?: string | null;
    referenceNumber?: string | null;
    notes?: string | null;
    recordedByUser?: {
      id: string;
      fullName: string;
      email: string;
    } | null;
  }>;
  history?: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: Date | string;
    changedBy: string;
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

export interface CreateCreditDto {
  scope: 'PROPERTY' | 'GENERAL';
  category?: string;
  subcategory?: string;
  dueDate?: string;
  amount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  isPaid?: boolean;
  payeeId?: string; // For credits, payeeId is who receives the credit
  contactId?: string;
  propertyId?: string;
  unitId?: string;
  leaseId?: string;
  details?: string;
  notes?: string;
  tags?: string[];
  paymentMethod?: string;
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
   * Create a credit transaction
   */
  async createCredit(
    creditData: CreateCreditDto,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    Object.entries(creditData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(API_ENDPOINTS.TRANSACTION.CREATE_CREDIT, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create credit';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Credit creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create credit: ${response.statusText}`;
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
   * Get a single transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<BackendTransaction> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.GET_ONE(transactionId), {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transaction');
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Update a transaction
   */
  async updateTransaction(
    transactionId: string,
    updateData: {
      category?: string;
      subcategory?: string;
      amount?: number;
      dueDate?: string;
      details?: string;
      notes?: string;
      tags?: string[];
    },
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (updateData.category) formData.append('category', updateData.category);
    if (updateData.subcategory) formData.append('subcategory', updateData.subcategory);
    if (updateData.amount !== undefined) formData.append('amount', updateData.amount.toString());
    if (updateData.dueDate) formData.append('dueDate', updateData.dueDate);
    if (updateData.details !== undefined) formData.append('details', updateData.details || '');
    if (updateData.notes !== undefined) formData.append('notes', updateData.notes || '');
    if (updateData.tags) {
      formData.append('tags', JSON.stringify(updateData.tags));
    }

    const response = await fetch(API_ENDPOINTS.TRANSACTION.UPDATE(transactionId), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update transaction');
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Update transaction discount
   */
  async updateDiscount(
    transactionId: string,
    discount: number,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();
    formData.append('discount', discount.toString());

    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(API_ENDPOINTS.TRANSACTION.UPDATE_DISCOUNT(transactionId), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update discount');
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Void a transaction
   */
  async voidTransaction(
    transactionId: string,
    reason: string,
    file?: File,
  ): Promise<BackendTransaction> {
    const formData = new FormData();
    formData.append('reason', reason);

    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(API_ENDPOINTS.TRANSACTION.VOID(transactionId), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to void transaction');
    }

    const result = await response.json();
    return result.transaction;
  }

  /**
   * Update a payment
   */
  async updatePayment(
    transactionId: string,
    paymentId: string,
    updateData: {
      amount?: number;
      paymentDate?: string;
      method?: string;
      paymentDetails?: string;
      referenceNumber?: string;
      notes?: string;
    },
    file?: File,
  ): Promise<any> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (updateData.amount !== undefined) formData.append('amount', updateData.amount.toString());
    if (updateData.paymentDate) formData.append('paymentDate', updateData.paymentDate);
    if (updateData.method) formData.append('method', updateData.method);
    if (updateData.paymentDetails !== undefined) formData.append('paymentDetails', updateData.paymentDetails || '');
    if (updateData.referenceNumber !== undefined) formData.append('referenceNumber', updateData.referenceNumber || '');
    if (updateData.notes !== undefined) formData.append('notes', updateData.notes || '');

    const response = await fetch(API_ENDPOINTS.TRANSACTION.UPDATE_PAYMENT(transactionId, paymentId), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update payment');
    }

    const result = await response.json();
    return result.payment;
  }

  /**
   * Delete a payment
   */
  async deletePayment(transactionId: string, paymentId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TRANSACTION.DELETE_PAYMENT(transactionId, paymentId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete payment');
    }
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

  /**
   * Get returnable deposits
   */
  async getReturnableDeposits(params?: {
    payerId?: string;
    contactId?: string;
    category?: string;
  }): Promise<ReturnableDeposit[]> {
    const queryParams = new URLSearchParams();
    if (params?.payerId) queryParams.append('payerId', params.payerId);
    if (params?.contactId) queryParams.append('contactId', params.contactId);
    if (params?.category) queryParams.append('category', params.category);

    const url = `${API_ENDPOINTS.TRANSACTION.GET_RETURNABLE_DEPOSITS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch returnable deposits');
    }

    const result = await response.json();
    return result.deposits;
  }

  /**
   * Return a deposit
   */
  async returnDeposit(
    returnData: ReturnDepositDto,
    file?: File,
  ): Promise<{ deposit: BackendTransaction; refundTransaction: BackendTransaction }> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    Object.entries(returnData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(API_ENDPOINTS.TRANSACTION.RETURN_DEPOSIT, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to return deposit';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Return deposit error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to return deposit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      deposit: result.deposit,
      refundTransaction: result.refundTransaction,
    };
  }

  /**
   * Get invoices that can have deposits/credits applied
   */
  async getApplicableInvoices(
    payerId?: string,
    contactId?: string,
    leaseId?: string,
  ): Promise<ApplicableInvoice[]> {
    const params = new URLSearchParams();
    if (payerId) params.append('payerId', payerId);
    if (contactId) params.append('contactId', contactId);
    if (leaseId) params.append('leaseId', leaseId);

    const response = await fetch(
      `${API_ENDPOINTS.TRANSACTION.GET_APPLICABLE_INVOICES}?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch applicable invoices';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch applicable invoices: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.invoices || [];
  }

  /**
   * Get available deposits and credits that can be applied
   */
  async getAvailableDepositsAndCredits(
    payerId?: string,
    contactId?: string,
    leaseId?: string,
  ): Promise<AvailableDepositCredit[]> {
    const params = new URLSearchParams();
    if (payerId) params.append('payerId', payerId);
    if (contactId) params.append('contactId', contactId);
    if (leaseId) params.append('leaseId', leaseId);

    const response = await fetch(
      `${API_ENDPOINTS.TRANSACTION.GET_AVAILABLE_DEPOSITS_CREDITS}?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch available deposits and credits';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch available deposits and credits: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.depositsAndCredits || [];
  }

  /**
   * Apply deposits/credits to invoices
   */
  async applyDepositCredit(
    applyData: ApplyDepositCreditDto,
    file?: File,
  ): Promise<{ message: string; applications: any[] }> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (applyData.payerId) {
      formData.append('payerId', applyData.payerId);
    }
    if (applyData.contactId) {
      formData.append('contactId', applyData.contactId);
    }
    if (applyData.leaseId) {
      formData.append('leaseId', applyData.leaseId);
    }

    formData.append('applications', JSON.stringify(applyData.applications));

    const response = await fetch(API_ENDPOINTS.TRANSACTION.APPLY_DEPOSIT_CREDIT, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to apply deposit/credit';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Apply deposit/credit error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to apply deposit/credit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }
}

export const transactionService = new TransactionService();

export interface Transaction {
  id: string;
  status: 'Paid' | 'Pending' | 'Void';
  dueDate: string;
  dueDateRaw?: string | null; // Raw ISO date for calculations
  date: string;
  category: string;
  property: string;
  contact: string;
  total: number;
  balance: number;
  type: 'income' | 'expense' | 'refund';
  transactionType: string;
  currency: string;
  isOverdue?: boolean; // Flag to indicate if transaction is overdue
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

export interface ReturnableDeposit {
  id: string;
  transactionId: string;
  payment: string;
  payer: string;
  method: string | null;
  balance: number;
  amount: number;
  category: string;
  date: string;
  dueDate: string | null;
  currency: string;
  property: string;
  lease: {
    id: string;
    status: string;
  } | null;
  payerId: string | null;
  contactId: string | null;
}

export interface ReturnDepositDto {
  transactionId: string;
  refundAmount: number;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  paymentMethod?: string;
  notes?: string;
  refundDate?: string; // ISO date string
}

export interface ApplicableInvoice {
  id: string;
  transactionId: string;
  dueDate: string;
  dueDateRaw: string | null;
  category: string;
  property: string;
  contact: string;
  amount: number;
  balance: number;
  currency: string;
}

export interface AvailableDepositCredit {
  id: string;
  transactionId: string;
  type: 'DEPOSIT' | 'CREDIT';
  category: string;
  amount: number;
  balance: number;
  currency: string;
  date: string;
  contact: string;
}

export interface ApplyDepositCreditItemDto {
  sourceTransactionId: string; // Deposit or Credit transaction ID
  targetTransactionId: string; // Invoice transaction ID
  amount: number;
  notes?: string;
}

export interface ApplyDepositCreditDto {
  payerId?: string;
  contactId?: string;
  leaseId?: string;
  applications: ApplyDepositCreditItemDto[];
}

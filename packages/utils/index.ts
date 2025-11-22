import { z } from 'zod';

// Validation schemas
export const emailSchema = z.string().email();

export const passwordSchema = z.string().min(6);

export const invoiceSchema = z.object({
  clientId: z.string(),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
    })
  ),
});

// Utility functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const calculateInvoiceTotal = (
  subtotal: number,
  taxRate: number,
  discount: number
): { taxAmount: number; total: number } => {
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return { taxAmount, total };
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    DRAFT: 'gray',
    SENT: 'blue',
    VIEWED: 'yellow',
    PAID: 'green',
    OVERDUE: 'red',
    CANCELLED: 'gray',
    OPEN: 'blue',
    IN_PROGRESS: 'yellow',
    RESOLVED: 'green',
    CLOSED: 'gray',
    PENDING: 'yellow',
    COMPLETED: 'green',
    FAILED: 'red',
  };
  return statusColors[status] || 'gray';
};

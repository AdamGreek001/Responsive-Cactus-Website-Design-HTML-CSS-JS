import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(clientId?: string) {
    const where = clientId ? { clientId } : {};
    return this.prisma.invoice.findMany({
      where,
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        items: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        items: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async create(data: any) {
    const { items, ...invoiceData } = data;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + taxAmount - (invoiceData.discount || 0);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    return this.prisma.invoice.create({
      data: {
        ...invoiceData,
        invoiceNumber,
        subtotal,
        taxAmount,
        total,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });
  }

  async update(id: string, data: any) {
    const { items, ...invoiceData } = data;

    // If items are provided, recalculate totals
    if (items) {
      const subtotal = items.reduce((sum: number, item: any) => {
        return sum + item.quantity * item.unitPrice;
      }, 0);

      const taxAmount = subtotal * ((invoiceData.taxRate || 0) / 100);
      const total = subtotal + taxAmount - (invoiceData.discount || 0);

      // Delete existing items and create new ones
      await this.prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      return this.prisma.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          subtotal,
          taxAmount,
          total,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          items: true,
          client: true,
        },
      });
    }

    return this.prisma.invoice.update({
      where: { id },
      data: invoiceData,
      include: {
        items: true,
        client: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: InvoiceStatus) {
    // Get current invoice to check existing timestamps
    const currentInvoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: { sentAt: true, paidAt: true },
    });

    if (!currentInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const updateData: any = { status };

    // Only set sentAt if not already set
    if (status === 'SENT' && !currentInvoice.sentAt) {
      updateData.sentAt = new Date();
    }
    
    // Only set paidAt if not already set
    if (status === 'PAID' && !currentInvoice.paidAt) {
      updateData.paidAt = new Date();
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
    });
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.invoice.count({
      where: {
        invoiceNumber: {
          startsWith: `INV-${year}`,
        },
      },
    });

    const nextNumber = (count + 1).toString().padStart(4, '0');
    return `INV-${year}-${nextNumber}`;
  }
}

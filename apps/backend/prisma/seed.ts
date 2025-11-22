import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      password: staffPassword,
      firstName: 'Staff',
      lastName: 'Member',
      role: 'STAFF',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✓ Staff user created:', staff.email);

  // Create client users
  const clientPassword = await bcrypt.hash('client123', 10);
  const client1User = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      password: clientPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CLIENT',
      isActive: true,
      emailVerified: true,
    },
  });

  const client1 = await prisma.client.upsert({
    where: { userId: client1User.id },
    update: {},
    create: {
      userId: client1User.id,
      company: 'Acme Corporation',
      phone: '+1-555-0123',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      billingEmail: 'billing@acme.com',
    },
  });
  console.log('✓ Client created:', client1User.email);

  const client2User = await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      password: clientPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'CLIENT',
      isActive: true,
      emailVerified: true,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { userId: client2User.id },
    update: {},
    create: {
      userId: client2User.id,
      company: 'Tech Solutions Ltd',
      phone: '+1-555-0456',
      address: '456 Tech Ave',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102',
      billingEmail: 'billing@techsolutions.com',
    },
  });
  console.log('✓ Client created:', client2User.email);

  // Create sample invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      clientId: client1.id,
      invoiceNumber: 'INV-2024-001',
      status: 'SENT',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: 1000,
      taxRate: 10,
      taxAmount: 100,
      discount: 0,
      total: 1100,
      notes: 'Thank you for your business',
      items: {
        create: [
          {
            description: 'Web Development Services',
            quantity: 40,
            unitPrice: 25,
            amount: 1000,
          },
        ],
      },
    },
  });
  console.log('✓ Invoice created:', invoice1.invoiceNumber);

  // Create sample payment
  await prisma.payment.create({
    data: {
      clientId: client1.id,
      invoiceId: invoice1.id,
      amount: 1100,
      method: 'STRIPE',
      status: 'COMPLETED',
      transactionId: 'txn_test_123456',
      paymentDate: new Date(),
    },
  });
  console.log('✓ Payment created');

  // Create sample subscription
  await prisma.subscription.create({
    data: {
      clientId: client2.id,
      planName: 'Professional Plan',
      planDescription: 'Full access to all features',
      amount: 99.99,
      currency: 'USD',
      billingCycle: 'monthly',
      status: 'ACTIVE',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✓ Subscription created');

  // Create sample ticket
  await prisma.ticket.create({
    data: {
      clientId: client1.id,
      assignedToId: staff.id,
      subject: 'Need help with invoice',
      description: 'I have a question about my recent invoice.',
      status: 'OPEN',
      priority: 'MEDIUM',
      messages: {
        create: [
          {
            message: 'I have a question about my recent invoice.',
            isInternal: false,
          },
        ],
      },
    },
  });
  console.log('✓ Ticket created');

  // Create knowledge base
  const category = await prisma.knowledgeCategory.create({
    data: {
      name: 'Getting Started',
      slug: 'getting-started',
      description: 'Learn the basics',
      isPublic: true,
      order: 1,
    },
  });

  await prisma.knowledgeArticle.create({
    data: {
      categoryId: category.id,
      title: 'How to create an invoice',
      slug: 'how-to-create-invoice',
      content: 'This article explains how to create and send invoices...',
      excerpt: 'Learn how to create invoices',
      isPublic: true,
    },
  });
  console.log('✓ Knowledge base article created');

  console.log('✅ Database seeding completed successfully!');
  console.log('\nTest accounts:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Staff: staff@example.com / staff123');
  console.log('Client: client1@example.com / client123');
  console.log('Client: client2@example.com / client123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to SaaS Platform
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Full-stack SaaS application with invoicing, payments, tickets, and client portal
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link 
            href="/auth/login"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Login{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Access your account
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Dashboard{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Admin dashboard
            </p>
          </Link>

          <Link
            href="/portal"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Client Portal{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Client self-service portal
            </p>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>✓ Invoices & Payments</div>
            <div>✓ Subscriptions</div>
            <div>✓ Support Tickets</div>
            <div>✓ Knowledge Base</div>
            <div>✓ Contracts</div>
            <div>✓ File Storage</div>
            <div>✓ Client Portal</div>
            <div>✓ Analytics</div>
          </div>
        </div>
      </div>
    </main>
  );
}

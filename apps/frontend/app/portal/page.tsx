'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export default function PortalPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'CLIENT') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.firstName} {user.lastName}
            </span>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                router.push('/auth/login');
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Support Tickets
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`${
                  activeTab === 'contracts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Contracts
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`${
                  activeTab === 'files'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Files
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'invoices' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Invoices</h2>
              <div className="text-gray-500">
                <p>Your invoices will appear here.</p>
                <p className="mt-2">
                  You can view, download, and pay your invoices from this section.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
              <div className="text-gray-500">
                <p>Your payment history will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Support Tickets</h2>
              <div className="text-gray-500">
                <p>Your support tickets will appear here.</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Create New Ticket
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Contracts</h2>
              <div className="text-gray-500">
                <p>Your contracts will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shared Files</h2>
              <div className="text-gray-500">
                <p>Files shared with you will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-gray-900">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/knowledge-base"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Knowledge Base</h3>
              <p className="text-sm text-gray-500">Browse help articles</p>
            </a>
            <a
              href="#"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Contact Support</h3>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </a>
            <a
              href="#"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">FAQs</h3>
              <p className="text-sm text-gray-500">Frequently asked questions</p>
            </a>
            <a
              href="#"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-medium text-gray-900 mb-1">Downloads</h3>
              <p className="text-sm text-gray-500">Download resources</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
